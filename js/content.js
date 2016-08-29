function loadJSON(path, callback) {
	var req = new XMLHttpRequest();
	req.overrideMimeType("application/json");

	req.open("GET", path, true);

	req.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == "200") {
			callback(JSON.parse(this.responseText));
		}
	};

	req.send(null);
}

var main_content;
loadJSON("js/content.json", function(data) {
	main_content = data;
	on_ready();
});

var nums = {
	"major": 1,
	"minor": 0,
	"mminor": 0,
	"mmminor": 0,
	"mmmminor": 0
};

var active_distro = "arch";

function inc_num(type) {
	switch(type) {
		case "major":
			nums.major++;
			nums.minor = 0;
			nums.mminor = 0;
			nums.mmminor = 0;
			nums.mmmminor = 0;
			break;

		case "minor":
			nums.minor++;
			nums.mminor = 0;
			nums.mmminor = 0;
			nums.mmmminor = 0;
			break;

		case "mminor":
			nums.mminor++;
			nums.mmminor = 0;
			nums.mmmminor = 0;
			break;

		case "mmminor":
			nums.mmminor++;
			nums.mmmminor = 0;
			break;

		case "mmmminor":
			nums.mmmminor++;
			break;
	}
}

function get_num_str() {
	var out = [];
	var keys = Object.keys(nums);

	for(id in keys) {
		var key = keys[id];
		if(nums[key] != 0) {
			out.push(nums[key]);
		}
	}

	return out.join(".");
}

function on_ready() {
	var elements = [];

	for(section_id in main_content.sections) {
		var element = $('<div class="section"></div>');

		var section = main_content.sections[section_id];

		var header_data = section.header;

		if("num_inc" in header_data) {
			inc_num(header_data.num_inc);
		}

		var header = $("<h" + header_data.type + ">" + "</h" + header_data.type + ">");
		header.text(get_num_str() + ". " + header_data.content);

		element.append(header);

		for(content_id in section.section) {
			var content = section.section[content_id];

			if(content.distro != "all") {
				if(content.distro.indexOf(active_distro) == -1) {
					continue;
				}
			}

			var p = $("<p></p>");
			p.html(content.content);

			if(content.note) {
				p.addClass("note");
			}

			element.append(p);
		}

		$(".wrapper").append(element);
	}

	for(i in main_content.available) {
		var distro = main_content.available[i];

		$('.distro-select-button[distro="' + distro + '"]').attr("disable", "0");
	}
}