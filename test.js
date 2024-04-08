function test() {
    let cover_progress = $("#cover_progress");
    let cover_trigger = $("#cover_trigger");
    let cover_photo_input = $("#cover_photo_input");
    let cover_photo = $("#cover_photo");
    let cover_preview = $("#cover_preview");
    let cover_photo_form = $("#cover_photo_form");
    let cover_message = $(".progress_msg");
    let remove_image = $("#remove_cover_image");
    let placeholder_link = $("#placeholder_link").val();
    let fake_ele_link = $("#fake_ele_link").val();
    let profile_ele = $("#profile");
    let btn_publish = $("#btn_to_publish");

    cover_photo_form.formUploader(
        function () {
            cover_trigger.html('<i class="fa fa-spin fa-circle-o-notch"></i> Uploading').attr("disabled", "disabled");
            cover_photo_input.attr("disabled", "disabled");
            cover_progress.find(".progress-bar").css("width", 0);
            cover_progress.removeClass("hidden");
            cover_message.html("");
            return true;
        },
        function (position, total, percent) {
            cover_progress.find(".progress-bar").css("width", percent + "%");
        },
        function (response) {
            cover_photo_input.removeAttr("disabled");
            cover_progress.addClass("hidden");
            if (response.status === "undefined") {
                cover_message.html("Upload failed!!! Unknown error occurred.").addClass("text-danger");
                cover_trigger.html('<i class="mdi mdi-swap-horizontal"></i> Retry').removeAttr("disabled");
                return;
            }
            if (response.status !== "success") {
                cover_message.html(response.error).addClass("text-danger");
                cover_trigger.html('<i class="mdi mdi-swap-horizontal"></i> Retry').removeAttr("disabled");
                return;
            }
            let permalink = response.permalink;
            cover_trigger.html('<i class="mdi mdi-swap-horizontal"></i> Change Image').removeAttr("disabled");
            cover_preview
                .css("background-image", "url(" + permalink + ")")
                .find("img")
                .attr("src", permalink);
            cover_photo.val(permalink);
            remove_image.removeClass("hidden");
            initImageLoadHandler(permalink);
        },
        function (error) {
            cover_message.html("Upload failed!!! Unable to connect to server.").addClass("text-danger");
            cover_trigger.html('<i class="mdi mdi-swap-horizontal"></i> Retry').removeAttr("disabled");
            cover_progress.addClass("hidden");
            cover_photo_input.removeAttr("disabled");
        }
    );
    cover_trigger.click(function () {
        cover_photo_input.click();
    });
    cover_photo_input.change(function () {
        cover_photo_form.submit();
    });
    remove_image.click(function () {
        cover_trigger.html('<i class="mdi mdi-plus-box-outline"></i> Add cover image &nbsp; &nbsp;').removeAttr("disabled");
        remove_image.addClass("hidden");
        cover_photo.val("");

        let permalink = placeholder_link;
        cover_preview
            .css("background-image", "url(" + permalink + ")")
            .find("img")
            .attr("src", permalink);
    });

    $(".nav-tabs").on("click", "a[disabled]", function (e) {
        e.preventDefault();
        return false;
    });
    $("#btn_to_avatar,#btn_to_avatar_").click(function () {
        $(".nav-tabs li a").removeClass("active");
        $($(".nav-tabs li")[1]).find("a").removeAttr("disabled").click();
    });
    $("#btn_to_start").click(function () {
        $($(".nav-tabs li")[0]).find("a").click();
    });
    $("#btn_to_finish,#btn_to_name").click(function () {
        $($(".nav-tabs li")[2]).find("a").removeAttr("disabled").click();
    });
    $("#btn_to_preview").click(function () {
        $($(".nav-tabs li")[3]).find("a").removeAttr("disabled").click();
    });
    btn_publish.click(function () {
        publishBanner();
    });

    $("#tab_profile").click(function (e) {
        let me = $(this);
        if (me.attr("disabled") !== undefined) {
            return;
        }
        scrollToTop();
        profile_ele.removeClass("name preview");
        profile_ele.addClass("avatar");
        builder_img.selectAreas({
            allowSelect: false,
            aspectRatio: 1,
            allowDelete: false,
            minSize: [10, 10],
            onChanged: debugQtyAreas,
            width: builder_img[0].width,
        });
        setTimeout(create_avatar_frame, 100);
    });
    $("#tab_name").click(function () {
        let me = $(this);
        if (me.attr("disabled") !== undefined) {
            return;
        }
        profile_ele.removeClass("avatar preview");
        profile_ele.addClass("name");
    });
    $("#tab_preview").click(function () {
        let me = $(this);
        if (me.attr("disabled") !== undefined) {
            return;
        }
        profile_ele.removeClass("avatar name");
        profile_ele.addClass("preview");
    });

    let meta_builder = $(".meta-builder");
    let name_builder = $("#name-builder");
    let builder_img = $(".meta-builder img");
    let is_square = false;
    let avatar_dimen = { width: 150, height: 150 };
    let avatar_axis = { top: 50, left: 50 };

    function prep_frame(img_src) {
        builder_img.attr("src", img_src);
        builder_img.selectAreas("destroy");
        $("#fake_avatar").remove();

        if (builder_img[0].complete) {
            refreshTabLock();
        } else {
            builder_img
                .one("load", function () {
                    refreshTabLock();
                })
                .on("error", function () {
                    builder_img.attr("src", builder_img.attr("src"));
                });
        }
    }

    function create_avatar_frame() {
        let len = builder_img.selectAreas("areas").length;
        if (len > 0) {
            // builder_img.selectAreas('remove', 0);
            return;
        }
        let fake_ele_ml = '<img id="fake_avatar" src="' + fake_ele_link + '"/>';
        builder_img.parent().append(fake_ele_ml);
        let areaOptions = {
            x: 50,
            y: 50,
            width: 150,
            height: 150,
        };
        builder_img.selectAreas("add", areaOptions);
    }

    function debugQtyAreas(event, id, areas) {
        if (is_square) {
            $(".select-areas-background-area, .select-areas-outline, #fake_avatar").css("border-radius", 0);
        } else {
            $(".select-areas-background-area, .select-areas-outline, #fake_avatar").css("border-radius", "50%");
        }
        if (areas === undefined || areas[0] === undefined) {
            return;
        }
        console.log(areas[0]);
        $("#fake_avatar").css({
            top: areas[0].y + "px",
            left: areas[0].x + "px",
            width: areas[0].width + "px",
            height: areas[0].height + "px",
        });
        avatar_dimen = { width: areas[0].width, height: areas[0].height };
        avatar_axis = { top: areas[0].y, left: areas[0].x };
        // console.log(areas.length + " areas", arguments);
    }

    $("#avatar_shape_circle").click(function () {
        $(".select-areas-background-area, .select-areas-outline, #fake_avatar").css("border-radius", "50%");
        is_square = false;
    });
    $("#avatar_shape_square").click(function () {
        $(".select-areas-background-area, .select-areas-outline, #fake_avatar").css("border-radius", 0);
        is_square = true;
    });

    let name_builder_size_control = $("#name-builder-size");
    let name_builder_bold_control = $("#btn-bold");
    let name_builder_italic_control = $("#btn-italic");
    let name_builder_underline_control = $("#btn-underline");
    let name_builder_color_control = $("#btn-color");
    let name_builder_font_control = $("#name-builder-font");
    let name_builder_wrap = $("#btn-wrap");
    let name_builder_align = $(".btn-align");
    let name_builder_is_bold = false;
    let name_builder_is_italized = false;
    let name_builder_is_underlined = false;
    let name_builder_color_code = "#000000";
    let name_builder_font = "Arial";
    let name_builder_font_size = 24;
    let parent_width = 750;
    let name_builder_axis = { top: 50, left: 50, align: "left", width: parent_width - 50, wrap: true };

    let image_loaded = false;

    let ck_finder_upload_url = $("#desc").attr("data-ckupload-url");
    let desc_editor;
    ClassicEditor.create(document.querySelector("#desc"), {
        ckfinder: {
            uploadUrl: ck_finder_upload_url,
        },
        toolbar: {
            items: ["heading", "|", "bold", "italic", "underline", "alignment", "link", "bulletedList", "numberedList", "blockQuote", "undo", "redo"],
        },
    })
        .then((editor) => {
            console.log("Editor Initialized successfully");
            desc_editor = editor;
            editor.model.document.on("change:data", (evt, data) => {
                let textData = editor.getData();
                $("#desc").val(textData);
            });
        })
        .catch((error) => {
            console.error(error);
        });

    name_builder.css("width", 750 - 50 + "px");

    $(".select2able, .select2").select2();
    name_builder_size_control.select2({
        tags: true,
    });
    $("#tags").select2({
        tags: true,
        tokenSeparators: [","],
    });
    name_builder_size_control.change(function () {
        let val = Number.parseInt(name_builder_size_control.children("option:selected").val());
        if (isNaN(val)) {
            val = 18;
        }
        name_builder_font_size = val;
        name_builder.css({ "font-size": val + "px" });
    });
    let text_change_handler = function () {
        let val = $(this).val().trim();
        if (val === "") {
            val = $(this).attr("placeholder");
        }
        name_builder.html(val);
    };
    $("#name-builder-text").keyup(text_change_handler);
    name_builder_bold_control.click(function () {
        if (name_builder_is_bold) {
            name_builder.css({ "font-weight": "normal" });
            name_builder_bold_control.removeClass("active");
            name_builder_is_bold = false;
            return;
        }
        name_builder.css({ "font-weight": "bold" });
        name_builder_bold_control.addClass("active");
        name_builder_is_bold = true;
    });
    name_builder_italic_control.click(function () {
        if (name_builder_is_italized) {
            name_builder.css({ "font-style": "normal" });
            name_builder_italic_control.removeClass("active");
            name_builder_is_italized = false;
            return;
        }
        name_builder.css({ "font-style": "italic" });
        name_builder_italic_control.addClass("active");
        name_builder_is_italized = true;
    });
    name_builder_underline_control.click(function () {
        if (name_builder_is_underlined) {
            name_builder.css({ "text-decoration": "none" });
            name_builder_underline_control.removeClass("active");
            name_builder_is_underlined = false;
            return;
        }
        name_builder.css({ "text-decoration": "underline" });
        name_builder_underline_control.addClass("active");
        name_builder_is_underlined = true;
    });

    let fk_ele = undefined;

    $("#hide_name").change(function () {
        let me = $(this);
        let checked = me[0].checked;
        if (checked) {
            name_builder.addClass("hidden");
        } else {
            name_builder.removeClass("hidden");
        }
    });

    let pickr = new Pickr({
        el: "#btn-color",
        useAsButton: true,
        default: name_builder_color_code,
        defaultRepresentation: "HEX",
        position: "left",
        appendToBody: true,
        components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
                hex: true,
                rgba: true,
                hsla: false,
                hsva: false,
                cmyk: false,
                input: true,
                clear: false,
                save: false,
            },
        },
        onChange(hsva, instance) {
            hsva; // HSVa color object, if cleared null
            let xar = hsva.toHEX();
            console.log();
            let color = "#" + xar[0] + "" + xar[1] + "" + xar[2];
            name_builder.css("color", color);
            name_builder_color_code = color;
        },
    });

    name_builder_align.click(function () {
        let me = $(this);
        let val = me.data("val");

        $(".btn-align").removeClass("active");
        me.addClass("active");

        let parent = parent_width;
        let width = name_builder.outerWidth();
        let left = name_builder[0].offsetLeft;

        name_builder.removeClass("left right center");

        if (val === "left") {
            left = fk_ele[0].offsetLeft;
            let new_width = parent_width - left;

            name_builder.addClass("left");
            name_builder_axis.align = "left";
            name_builder_axis.left = left;
            name_builder_axis.width = new_width;
            name_builder.css({ left: left + "px", width: new_width + "px" });

            $("#fk_name_builder").remove();
            fk_ele = undefined;
        } else if (val === "center") {
            if (name_builder_axis.align === "left") {
                fk_ele = name_builder.clone();
                fk_ele.attr("id", "fk_name_builder");
                fk_ele.css({ width: "auto", visibility: "hidden" });

                name_builder.parent().append(fk_ele);
            }
            let fk_width = fk_ele.outerWidth();
            let fk_left = fk_ele[0].offsetLeft;

            let fk_center = fk_left + fk_width / 2;
            let to_left = fk_center;
            let to_right = parent_width - fk_center;

            if (to_left < 50) {
                to_left = 50;
            }
            if (to_right < 50) {
                to_right = 50;
            }

            if (to_left < to_right) {
                left = 0;
                width = to_left * 2;
            } else {
                width = to_right * 2;
                left = to_left - to_right;
            }

            name_builder.addClass("center");
            name_builder_axis.align = "center";
            name_builder_axis.left = left;
            name_builder_axis.width = width;
            name_builder.css({ left: left + "px", width: width + "px" });
        } else if (val === "right") {
            if (name_builder_axis.align === "left") {
                // create a fake element with width auto, and visibility hidden
                // determine the width,
                // new width = left + width
                // text-align becomes right

                fk_ele = name_builder.clone();
                fk_ele.attr("id", "fk_name_builder");
                fk_ele.css({ width: "auto", visibility: "hidden" });
            } else {
                left = fk_ele[0].offsetLeft;
            }

            name_builder.parent().append(fk_ele);
            let fk_width = fk_ele.outerWidth();
            let new_width = fk_width + left;

            name_builder.addClass("right");
            name_builder_axis.align = "right";
            name_builder_axis.left = 0;
            name_builder_axis.width = new_width;
            name_builder.css({ width: new_width + "px" });
        }
    });
    name_builder_wrap.click(function () {
        if (name_builder_axis.wrap) {
            name_builder_axis.wrap = false;
            $(".name-builder").addClass("nowrap");
            name_builder_wrap.removeClass("active");
        } else {
            name_builder_axis.wrap = true;
            $(".name-builder").removeClass("nowrap");
            name_builder_wrap.addClass("active");
        }
    });

    // name_builder_color_control.colorpicker();
    // name_builder_color_control.on('changeColor', function (event) {
    //     let color = event.color.toString();
    //     name_builder.css('color', color);
    //     name_builder_color_code = color;
    // });

    name_builder_font_control.change(function () {
        let new_font = name_builder_font_control.children("option:selected").val();
        let font_id = "specimen_" + new_font.replace(/ /gi, "_");

        if (new_font === "Default") {
            name_builder.css("font-family", "unset");
            name_builder_font = "";
            return;
        }

        if ($("#" + font_id).length === 0) {
            let g_link = "https://fonts.googleapis.com/css?family=" + encodeURI(new_font) + ":400,700";
            let font_ml = '<link href="' + g_link + '" rel="stylesheet" id="' + font_id + '">';
            $("head").append(font_ml);
        }
        name_builder.css("font-family", '"' + new_font + '", sans-serif');
        name_builder_font = new_font;
    });

    let banner_name = $("#name");
    let category = $("#category");
    let tags = $("#tags");
    banner_name.keyup(function () {
        refreshTabLock();
    });

    function onImageLoaded(permalink) {
        image_loaded = true;
        cover_progress.addClass("hidden");
        prep_frame(permalink);
        refreshTabLock();
    }

    function initImageLoadHandler(permalink) {
        cover_progress.removeClass("hidden");

        cover_preview.css("background-image", "url(" + permalink + ")");
        let img = cover_preview.find("img");

        img.attr("src", permalink);

        if (img[0].complete) {
            onImageLoaded(permalink);
        } else {
            img.one("load", function () {
                onImageLoaded(permalink);
            }).on("error", function () {
                img.attr("src", img.attr("src"));
            });
        }
    }

    function scrollToTop() {
        $("html,body").animate({ scrollTop: 50 }, 0);
    }

    function refreshTabLock() {
        if (banner_name.val().trim() === "" || category.val().trim() === "" || cover_photo.val().trim() === "" || cover_photo.val() === placeholder_link || !image_loaded) {
            //lock tabs
            $(".nav-tabs li").slice(1).find("a").attr("disabled", "disabled");
            $("#btn_to_avatar").attr("disabled", "disabled");
            return;
        }
        $($(".nav-tabs li")[2]).find("a").attr("disabled", "disabled");
        $("#btn_to_avatar").removeAttr("disabled");
    }

    let dragging = false;
    let iX, iY;
    let handler = function (e) {
        cancelEvent(e);
        let parent = $(".meta-builder").closest(".tab-pane");
        if (!parent.has(".name")) {
            return;
        }
        // if (e.which !== undefined && e.which !== 1) {
        //     console.log('Which: ' + e.which);
        //     return;
        // }
        let mousePos = getMousePosition(e);
        dragging = true;
        iX = mousePos.x - this.offsetLeft;
        iY = mousePos.y - this.offsetTop;
        if (name_builder_axis.align === "right" || name_builder_axis.align === "center") {
            iX = mousePos.x - fk_ele[0].offsetLeft;
        }
        // this.setCapture && this.setCapture();
        initializeRepositioning();
        return false;
    };
    name_builder.on("mousedown", handler).bind("touchstart", handler);

    let error_msg = $("#msg");

    let moveHandler = function (e) {
        if (dragging) {
            cancelEvent(e);
            // let parent = $('.meta-builder').offset();
            e = e || window.event;
            let mousePos = getMousePosition(e);
            let oX = mousePos.x - iX;
            let oY = mousePos.y - iY;

            name_builder_axis.left = oX;
            name_builder_axis.top = oY;

            let width = name_builder.outerWidth();

            if (oY < 0) {
                oY = 0;
            }
            if (oX < 0) {
                oX = 0;
            }
            if (name_builder_axis.align === "left") {
                width = parent_width - oX;
                if (width < 50) {
                    width = 50;
                }
                name_builder_axis.width = width;
                name_builder.css({
                    left: oX + "px",
                    top: oY + "px",
                    width: width + "px",
                });
            } else if (name_builder_axis.align === "center") {
                let fk_width = fk_ele.outerWidth();
                let fk_center = oX + fk_width / 2;
                let to_left = fk_center;
                let to_right = parent_width - fk_center;
                let left = 0;

                if (to_left < 50) {
                    to_left = 50;
                }
                if (to_right < 50) {
                    to_right = 50;
                }

                if (to_left < to_right) {
                    left = 0;
                    width = to_left * 2;
                } else {
                    width = to_right * 2;
                    left = to_left - to_right;
                }
                name_builder_axis.left = left;
                name_builder_axis.width = width;

                name_builder.css({
                    left: left + "px",
                    top: oY + "px",
                    width: width + "px",
                });
                fk_ele.css("left", oX + "px");
            } else if (name_builder_axis.align === "right") {
                let width = fk_ele.outerWidth() + oX;
                if (width > parent_width) {
                    width = parent_width;
                }
                if (width < 50) {
                    width = 50;
                }
                name_builder_axis.left = 0;
                name_builder_axis.width = width;
                name_builder.css({
                    top: oY + "px",
                    width: width + "px",
                });
                fk_ele.css("left", oX + "px");
            }
            // return false;
        }
    };
    let upHandler = function (e) {
        cancelEvent(e);
        let textele = name_builder[0];
        // dragging = false;
        // textele.setCapture && textele.releaseCapture();
        // e.cancelBubble = true;
        finalizeRepositioning();
    };

    function initializeRepositioning() {
        $(document).on("mousemove", moveHandler).on("touchmove", moveHandler);
        $(document).on("mouseup", upHandler).on("touchend", upHandler);
    }

    function finalizeRepositioning() {
        $(document).off("mousemove", moveHandler).off("touchmove", moveHandler);
        $(document).off("mouseup", upHandler).off("touchend", upHandler);
    }

    function publishBanner() {
        let data = {
            name: banner_name.val(),
            banner_image: cover_photo.val(),
            avatar_shape: is_square ? "square" : "circle",
            avatar_dimension: avatar_dimen,
            avatar_axis: avatar_axis,
            name_font: name_builder_font,
            name_color_code: name_builder_color_code,
            name_is_underlined: name_builder_is_underlined,
            name_is_italized: name_builder_is_italized,
            name_is_bold: name_builder_is_bold,
            name_font_size: name_builder_font_size,
            name_axis: name_builder_axis,
            category: category.val(),
            tags: tags.val(),
            cta: $("#cta").val(),
            cta_link: $("#cta_link").val(),
            visibility: $('[name="visibility"]:checked').val(),
            name_visibility: $('[name="name_visibility"]')[0].checked ? "hidden" : "visible",
            hashtag: $("#hashtag").val(),
            desc: $("#desc").val(),
        };
        let url = $("#publish_link").val();
        btn_publish.attr("disabled", "disabled").html('<i class="fa fa-spinner fa-spin"></i>');
        console.log(data);
        $.post(url, data, "json")
            .done(function (d) {
                if (d.status === undefined) {
                    btn_publish.html("Publish").removeAttr("disabled");
                    error_msg.html("Unknown error occurred, pls try again later").attr("class", "text-danger").fadeIn(300);
                    return;
                }
                if (d.status !== "success") {
                    btn_publish.html("Publish").removeAttr("disabled");
                    error_msg.html(d.message).attr("class", "text-danger").fadeIn(300);
                    return;
                }
                window.location.href = d.next;
            })
            .fail(function (error) {
                btn_publish.html("Publish").removeAttr("disabled");
                error_msg.html("Unable to connect, Check your internet connection and try again").attr("class", "text-danger").fadeIn(300);
            });
    }

    function cancelEvent(e) {
        let event = e || window.event || {};
        event.cancelBubble = true;
        event.returnValue = false;
        event.stopPropagation && event.stopPropagation(); // jshint ignore: line
        event.preventDefault && event.preventDefault(); // jshint ignore: line
    }

    function getMousePosition(event) {
        if (!event.pageX) {
            if (event.originalEvent) {
                event = event.originalEvent;
            }
            if (event.changedTouches) {
                event = event.changedTouches[0];
            }

            if (event.touches) {
                event = event.touches[0];
            }
        }
        let x = event.pageX,
            y = event.pageY;

        return { x: x, y: y };
    }

    // $('#btn_to_name').click();
}
