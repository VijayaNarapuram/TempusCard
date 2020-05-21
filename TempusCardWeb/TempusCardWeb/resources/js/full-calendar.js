var org_name = $("input#org_Name").val();
var app_path = $("input#app_path").val();

var org_path = app_path + "/";


$(document).ready(function() {
    /* initialize the external events
         -----------------------------------------------------------------*/

    $('#external-events div.external-event').each(function() {

        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim($(this).text()) // use the element's text as the event title
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true, // will cause the event to go back to its
            revertDuration: 0 //  original position after the drag
        });

    });


    /* initialize the calendar
     -----------------------------------------------------------------*/
    var userRole = $("span#userRole").text();
    userRole = userRole.toLowerCase();
    var loggedInUserId = $("span#loggedInUserId").text();
    if (userRole == 'superadmin' || userRole == 'admin') {
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: false,
            events: [],
            eventRender: function(event, element) {
                element.attr('href', 'javascript:void(0);');
                element.click(function() {
                    $("#eventDate").html(event.dispalyDate);
                    $("#eventId").html(event.id);
                    $('#eventTitle').html(event.eventTitle);
                    $('#eventInfo').html(event.description);
                    $("#eventType").html(event.type);
                    $("#eventVisibleTo").html(event.eventVisibleTo);
                    $('#eventUrl').attr('href', event.url);
                    $("#projId").html(event.projectId);
                    $("#orgId").html(event.visibleToOrg);
                    $("#createdBy").html(event.createdBy);
                    $("#createdDate").html(event.createdDate);
                    if (loggedInUserId != event.createdBy) {
                        if (userRole == 'superadmin') {
                            $("#superadmin_footer_edit").hide();
                            $("#superadmin_footer_delete").hide();
                        } else {
                            $("#admin_footer_edit").hide();
                            $("#admin_footer_delete").hide();
                        }
                    } else {
                        if (userRole == 'superadmin') {
                            $("#superadmin_footer_edit").show();
                            $("#superadmin_footer_delete").show();
                        } else {
                            $("#admin_footer_edit").show();
                            $("#admin_footer_delete").show();
                        }
                    }
                    $('#fullCalModal').modal();
                });
            },
            dayClick: function(date, allDay, jsEvent, view) {
                var selectdate = $.fullCalendar.formatDate(date, $("input#dateFormat").val());
                $("#date").val(selectdate);
                $('#Modal-AddEvent').modal();
                return false;
            },
            eventMouseover: function(calEvent, jsEvent, view) {
                var eventDate = $.fullCalendar.formatDate(calEvent.start, $("input#dateFormat").val());
                $(this).attr('title', eventDate + "  " + calEvent.title + "  " + calEvent.description);
                $(this).css('font-weight', 'normal');
            },
            eventMouseout: function(calEvent, jsEvent, view) {
                $(this).css('font-weight', 'normal');
            },
            loading: function(bool) {
                if (bool) $('#loading').show();
                else $('#loading').hide();
            }
        });
    } else {
        $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: false,
            events: [],
            eventRender: function(event, element) {
                element.attr('href', 'javascript:void(0);');
                element.click(function() {
                    $("#eventDate").html(event.dispalyDate);
                    $("#eventId").html(event.id);
                    $('#eventTitle').html(event.eventTitle);
                    $('#eventInfo').html(event.description);
                    $("#eventTypeId").html(event.typeId);
                    $("#eventType").html(event.type);
                    $("#eventVisibleTo").html(event.eventVisibleTo);
                    $('#eventUrl').attr('href', event.url);
                    $("#projId").html(event.projectId);
                    $("#orgId").html(event.visibleToOrg);
                    $("#createdBy").html(event.createdBy);
                    $("#eventCreatedDate").html(event.createdDate);
                    $('#fullCalModal').modal();
                });
            },
            eventMouseover: function(calEvent, jsEvent, view) {
                var eventDate = $.fullCalendar.formatDate(calEvent.start, $("input#dateFormat").val());
                $(this).attr('title', eventDate + "  " + calEvent.title + "  " + calEvent.description);
                $(this).css('font-weight', 'normal');
            },
            eventMouseout: function(calEvent, jsEvent, view) {
                $(this).css('font-weight', 'normal');
            },
            loading: function(bool) {
                if (bool) $('#loading').show();
                else $('#loading').hide();
            }
        });
    }
});

function getCalendarData() {
    var dateFormat = $("input#dateFormat").val();
    var newFormat = dateFormat.toUpperCase();
    $('#calendarDatepicker').datetimepicker({
        format: newFormat,
        ignoreReadonly:true
    });
    $('#calendarDatepicker').on('changeDate', function(ev) {
        if (ev.viewMode === 'days') {
            $(this).datepicker('hide');
        }
    });

      $('#calendarDatepicker1').datetimepicker({
        format: newFormat,
        ignoreReadonly:true
    });
    $('#calendarDatepicker1').on('changeDate', function(ev) {
        if (ev.viewMode === 'days') {
            $(this).datepicker('hide');
        }
    });
    $.ajax({
        type: "POST",
        url: "getCalendarData",
        data: {},
        success: function(data) {
            showCalendar(data);
        },
        error: function(result) {}
    });
}

function showCalendar(data) {
    for (var i = 0; i < data.length; i++) {
        var source = [{
            id: data[i].id,
            title: data[i].title,
            start: data[i].date,
            end: data[i].date,
            description: data[i].description,
            dispalyDate: data[i].orgFormatCreatedDate,
            url: '',
            allDay: true,
            type: data[i].typeValue,
            typeId: data[i].type,
            eventVisibleTo: data[i].eventVisibleTo,
            eventTitle: data[i].title,
            eventDate: data[i].date,
            color: data[i].eventColor,
            projectId: data[i].projectId,
            createdBy: data[i].createdBy,
            createdDate: data[i].createdDate,
            visibleToOrg: data[i].visibleToOrg
        }];
        $('#calendar').fullCalendar('addEventSource', source);
    }
}