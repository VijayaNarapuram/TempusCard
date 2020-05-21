$(window).load(function() {
    $('#loader').fadeOut();
});
var org_name = $("input#org_Name").val();
var app_path = $("input#app_path").val();

var org_path = app_path + "/";
var SERVER_LOCATION = "";
var GLOBAL_ROW_NUMBER = 1001;
var GLOBAL_DATE = "START";
var SELECTED_PROJECT = "";
var DEPENDENCY = "";

var activeTimer = setInterval(function() {
    Timer();
}, 1000);

function handleClientTime() {
    var clientTime = $("input#loggedInDate").val();
    $("input#clientTime").val(clientTime);
}

function getClientTimeZone() {
    var timezone = jstz.determine();
    var tz = timezone.name();
    $("input#j_timeZone").val(tz);
    var currentTime = moment().format("DD/MM/YYYY HH:mm:ss");
    $("input#j_clientTime").val(currentTime);
    var orgName = $("input#org_name").val();
    $("input#j_organisation").val(orgName);
}

function Timer() {
    var now = moment().format("DD/MM/YYYY HH:mm:ss");
    var then = $("input#loggedInDate").val();
    var ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
    $('#timeActive').text(s);
}

$("#closeButtonModal").click(function() {
    $("#formid")[0].reset();
});

$("a#viewLeaveRequestApproval").click(function() {
    var rowObj = $(this).parent().parent().get(0);
    $("#popupEmpName").text(rowObj.children[0].textContent);
    $("#popupCreatedDate").text(rowObj.children[1].textContent);
    $("#popupFromDate").text(rowObj.children[2].textContent);
    $("#popupToDate").text(rowObj.children[3].textContent);
    $("#popupType").text(rowObj.children[4].textContent);
    $("#popupSubject").text(rowObj.children[5].textContent);
    $("#popupMessage").text(rowObj.children[6].textContent);
    $("span#popupTypeId").text(rowObj.children[9].textContent);
    $("span#popupEmpId").text(rowObj.children[10].textContent);
    $("span#popupLeaveId").text(rowObj.children[11].textContent);
});

$("img#viewLeaveRequest").click(function() {
    var rowObj = $(this).parent().parent().get(0);
    $("label#popupFromDate").text(rowObj.children[0].textContent);
    $("label#popupToDate").text(rowObj.children[1].textContent);
    $("label#popupCreatedDate").text(rowObj.children[2].textContent);
    $("label#popupSubject").text(rowObj.children[3].textContent);
    $("label#popupStatus").text(rowObj.children[4].textContent);
    $("label#popupMessage").text(rowObj.children[5].textContent);
});

//viewLeaveRequest()
function adminLeaveAprrove() {
    $('#loader').show();
    var empName = $("#popupEmpName").text();
    var empId = $("#popupEmpId").text();
    var fromDate = $("#popupFromDate").text();
    var toDate = $("#popupToDate").text();
    var sendTo = $("#popupEmpId").text();
    var title = $("#popupSubject").text();
    var status = $("#approveStatus").val();
    var id = $("#popupLeaveId").text();
    var comments = $("#popupComments").val();
    var leaveRequest = {};
    leaveRequest.empId = empId;
    leaveRequest.empName = empName;
    leaveRequest.id = id;
    leaveRequest.subject = title;
    leaveRequest.toDate = toDate;
    leaveRequest.fromDate = fromDate;
    leaveRequest.status = status;
    leaveRequest.comments = comments;
    $.ajax({
    	
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "POST",
        url: org_path + "adminLeaveApproval",
        async: false,
        dataType: 'json',
        data: JSON.stringify(leaveRequest),
        
        success: function(data) {
            $('#loader').hide();
            $('#approveS').hide();
            
            $('#closeButtonLeaveApprove').hide();
            $('#submitApprove').hide();
            
            $('#SuccessMsg').show();
            
            $('#okButtonLeaveApprove').show();
            window.setTimeout('location.reload()', 3000);
        },
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
}

// When a Manager poses a Question in the Accordion in the Popup
// AND clicks on ASK then the following method is invoked
// here we get all the critical details needed for saving the question
// We also close the popup after a question is posed
function saveAskedQuestion() {
    var employeeId = $("#popupEmployeeId").text();
    var fromDate = $("#popupFromDate").text();
    var toDate = $("#popupToDate").text();
    var sendTo = $("#empid").text();
    var title = $("#popupTitle").text();
    var question = $("input#question").val();
    sendTo = $("#selectSendTo option:selected").val();
    $("input#question").val("");
    var ques = {};
    ques.questionPosed = question;
    ques.questionPosedTo = sendTo;
    var questionResponseArray = [];
    questionResponseArray.push(ques);
    var leaveRequest = {};
    leaveRequest.title = title;
    leaveRequest.toDate = toDate;
    leaveRequest.fromDate = fromDate;
    leaveRequest.questionResponse = questionResponseArray;
    var jsonObj = {};
    jsonObj.employeeId = employeeId;
    jsonObj.leaveRequest = leaveRequest;
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "POST",
        url: "employeeProjects",
        async: false,
        dataType: 'json',
        data: JSON.stringify(jsonObj),
        success: function(data) {},
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
} // saveAskedQuestion()

// Employee :Displaying Employee Projects
$("a#empProject").click(function() {
    var rowObj = $(this).parent().parent().get(0);
    $("input#employeeId").val(rowObj.children[7].textContent);
    $("#popupEmployeeName").text(rowObj.children[0].textContent);
    var employeeId = $("#employeeId").val();
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "GET",
        url: org_path + "getEmployee",
        async: false,
        dataType: 'json',
        data: {
            employee: employeeId
        },
        success: function(data) {
            // Remove all Current Project Rows
            $("#projectRoleTable tbody").find("tr").remove();
            for (var i = 0; i < data.empCurrentProjects.length; i++) {
                var tProjectName = data.empCurrentProjects[i].name;
                var tRowText = "<tr " + 'id="R' + i + '"' + ">";
                tRowText += "<td>" + tProjectName + "</td>";
                tRowText += "</tr>";
                $('#projectRoleTable tbody').append(tRowText);
            } // for
        },
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});

$("a#empDetails").click(function() {
    var rowObj = $(this).parent().parent().get(0);
    $("input#employeeId").val(rowObj.children[7].textContent);
    $("#popupEmpName").text(rowObj.children[0].textContent);
    var employeeId = $("#employeeId").val();
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "GET",
        url: org_path + "getEmployee",
        async: false,
        dataType: 'json',
        data: {
            employee: employeeId
        },
        success: function(data) {
            $("#employeeData").find("#employeefirstName").text(data.employee.firstName);
            $("#employeeData").find("#employeeLastName").text(data.employee.lastName);
            $("#employeeData").find("#employeeEmail").text(data.employee.email);
            $("#employeeData").find("#employeeMobile").text(data.employee.mobile);
            console.log(data.employee.gender);
            if (data.employee.gender == true) {
                $("#employeeData").find("#employeeGender").text("Male");
            } else {
                $("#employeeData").find("#employeeGender").text("Female");
            }
            $("#employeeData").find("#employeeDOB").text(data.employee.dateOfBirth);
            $("#employeeData").find("#employeePan").text(data.employee.pan);
            $("#employeeData").find("#employeeAddress").text(data.employee.address);
            $("#employeeData").find("#employeeRole").text(data.employee.role);
            $("#employeeData").find("#employeeDOJ").text(data.employee.dateOfJoining);
            $("#employeeData").find("#employeeEMPCode").text(data.employee.empCode);
            $("#employeeData").find("#employeeDesignation").text(data.employee.designation);
            $("#employeeData").find("#employeeBankName").text(data.employee.bankName);
            $("#employeeData").find("#employeeAccNumber").text(data.employee.accountNumber);
            $("#employeeData").find("#employeeRoutingId").text(data.employee.routingId);
            $("#employeeData").find("#employeeManager").text(data.employee.managerName);

            $("#employeeData").find("#employeeSalary").text(data.employee.grossSalary);
            $("#employeeData").find("#employeeDepartment").text(data.employee.department);
            if (data.employee.sodexoApplicable == true) {
                $("#employeeData").find("#employeeSodexo").text("Yes");
            } else {
                $("#employeeData").find("#employeeSodexo").text("No");
            }
            if (data.employee.active == true) {
                $("#employeeData").find("#employeeStatus").text("Active");
            } else {
                $("#employeeData").find("#employeeStatus").text("InActive");
            }
        },
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});

//Employee Edit/Update.
$("img#edit").click(function() {
    var rowObj = $(this).parent().parent().get(0);
    $(".employeeData").find("#employee_Id").val(rowObj.children[6].textContent);
    var employeeId = $("#employee_Id").val();
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "GET",
        url: "getEmployee",
        async: false,
        dataType: 'json',
        data: {
            employee: employeeId
        },
        success: function(data) {
            $(".employeeData").find("#employee_Id").val(data.employee.id);
            $(".employeeData").find("#employee_Name").val(data.employee.name);
            $(".employeeData").find("#employee_Email").val(data.employee.email);
            $(".employeeData").find("#employee_EmpCode").val(data.employee.employeeCode);
            $(".employeeData").find("#employee_Password").val(data.employee.password);
            $(".employeeData").find("#employee_Mobile").val(data.employee.mobile);
            $(".employeeData").find("#employee_DOB").val(data.employee.dateOfBirth);
            $(".employeeData").find("#employee_DOJ").val(data.employee.dateOfJoining);
            $(".employeeData").find("#employee_Manager").val(data.employee.managerId);
            $(".employeeData").find("#employee_Address").val(data.employee.address);
            $(".employeeData").find("#employee_Designations").empty();
            for (var i = 0; i < data.designations.length; i++) {
                var text = '<option  value="' + data.designations[i] + '"';
                if ((data.employee.designation) == (data.designations[i])) text = text + ' selected="selected"';
                text = text + '>' + data.designations[i] + '</option>';
                $(".employeeData").find("#employee_Designations").append(text);
            }
            // Set Gender
            if (data.employee.gender == true) {
                $(".employeeData").find("#gender_M").prop('checked', true);
            } else {
                $(".employeeData").find("#gender_F").prop('checked', false);
            }
            if (data.employee.active) {
                $(".employeeData").find("#status_Active").prop('checked', true);
            } else {
                $(".employeeData").find("#status_InActive").prop('checked', true);
            }
            $(".employeeData").find("#employee_Salary").val(data.employee.grossSalary);
            $(".employeeData").find("#employee_Department").val(data.employee.department);
            $(".employeeData").find("#employee_BankName").val(data.employee.bankName);
            $(".employeeData").find("#employee_PAN").val(data.employee.pan);
            $(".employeeData").find("#employee_AccNumber").val(data.employee.accountNumber);
            if (data.employee.sodexoApplicable) {
                $(".employeeData").find("#Sodexo_Applicable").prop('checked', true);
            } else {
                $(".employeeData").find("#Sodexo_NotApplicable").prop('checked', true);
            }
        },
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});

// TIMESHEET - when a Row is deleted for the day from the list delete the row
function deleteRow(num) {
    // Check for user confirmation
    var r = confirm("Do you really want to Delete this Timesheet");
    if (r != true) {
        return;
    }
    var tsProjectId = $("#ROW_" + num).find('input[id="tsProjectId"]').val();
    var tsTask = $("#ROW_" + num).find("td:eq(1)").text();
    var tsActivity = $("#ROW_" + num).find("td:eq(2)").text();
    var jsonObj = {};
    var jsonTimeSheetFormObj = {};
    var timeSheetLine = [];
    jsonObj.activity = tsActivity;
    jsonObj.task = tsTask;
    jsonObj.projectId = tsProjectId;
    timeSheetLine.push(jsonObj);
    jsonTimeSheetFormObj.timeSheetLine = timeSheetLine;
    jsonTimeSheetFormObj.date = $("#tsDate").val();
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "POST",
        url: "deleteTimeSheet",
        async: false,
        dataType: 'json',
        data: JSON.stringify(jsonTimeSheetFormObj),
        success: function(data) {
            location.reload();
        },
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
    getTimesheet();
}

// deleteRow
// TIMESHEET - when the user clicks on the modify button (pencil) then let the
// user modify the row
function modifyRow(num) {
    var isVisible = $("#panel-collapse-5").is(":visible");
    // If not Visible, make it visible & let the user update the data
    if (!isVisible) {
        $("#invokeCollapse").click();
    }
    var tsProjectId = $("#ROW_" + num).find('input[id="tsProjectId"]').val();
    var tsDependencyId = $("#ROW_" + num).find('input[id="tsDependencyId"]').val();
    var tsResolutions = $("#ROW_" + num).find('input[id="tsResolutions"]').val();
    var tsIssues = $("#ROW_" + num).find('input[id="tsIssues"]').val();
    var tsProject = $("#ROW_" + num).find("td:eq(0)").text();
    var tsTask = $("#ROW_" + num).find("td:eq(1)").text();
    var tsActivity = $("#ROW_" + num).find("td:eq(2)").text();
    var tsHours = $("#ROW_" + num).find("td:eq(3)").text();
    var tsStatus = $("#ROW_" + num).find("td:eq(4)").text();
    var tsPriority = $("#ROW_" + num).find("td:eq(5)").text();
    var tsDifficulty = $("#ROW_" + num).find("td:eq(6)").text();
    // We are disbling Project, Task, Activity fields (being done below)
    // We update those values there itself
    $("#tsHours").val(tsHours);
    $("#tsIssues").val(tsIssues);
    $("#tsResolutions").val(tsResolutions);
    $("#tsTaskStatus > [value=" + tsStatus + "]").attr("selected", "true");
    $("#tsPriority > [value=" + tsPriority + "]").attr("selected", "true");
    $("#tsDifficulty > [value=" + tsDifficulty + "]").attr("selected", "true");
    if ($("#tsSelectProject option[value='" + tsProjectId + "']").val() === undefined) {
        $('#tsSelectProject').append(new Option(tsProject, tsProjectId));
    }
    $("#tsSelectProject > [value=" + tsProjectId + "]").attr("selected", "true");
    $('#tsDependency > [value="' + tsDependencyId + '"]').attr("selected", "true");
    // Disable Project, Task, Activity  when being modified
    $("#tsSelectProject").prop("disabled", true);
    $("#tsTask").val(tsTask).attr('disabled', 'disabled');
    $("#tsActivity").val(tsActivity).attr('disabled', 'disabled');
}

// modifyRow
function callAccordionOpen() {
    $("#tsTask").removeAttr('disabled');
    $("#tsActivity").removeAttr('disabled');
    $("#tsSelectProject").prop("disabled", false);
}

// callAccordionOpen(){
// TIMESHEET - Get the default timesheet for the given date;
function getTimesheet() {
    GLOBAL_DATE = $("#tsDate").val();
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "POST",
        url: "getTimeSheet",
        async: false,
        dataType: 'json',
        data: JSON.stringify({
            date: GLOBAL_DATE
        }),
        success: function(data) {
            // Change TimeSheet Project Selection List
            $('#tsSelectProject').empty();
            for (var i = 0; i < data.employeeProjectList.length; i++) {
                $('#tsSelectProject').append(new Option(data.employeeProjectList[i].name, data.employeeProjectList[i].id));
            }
            $('#tsDependency').empty();
            for (var i = 0; i < data.employeeList.length; i++) {
                $('#tsDependency').append(new Option(data.employeeList[i].name, data.employeeList[i].id));
            }
            $('#tsDependency').prepend(new Option("None"));
            var msg = "No data found";
            if (data.timeSheetLine.length == 0) {
                $('.tableProjectTasks > tbody').empty();
                newRow = "<tr align><td></td><td></td><td></td><td></td><td class='center'><h4>" + msg + "</h4></td></tr>";
                $('#tableProjectTasks > tbody').append(newRow);
            } else {
                $('.tableProjectTasks > tbody').empty();
                for (var i = 0; i < data.timeSheetLine.length; i++) {
                    newRow = '<tr class="odd gradeX"  ' + 'id="ROW_' + (i) + '">' + "<td class='center'><h6>" + data.timeSheetLine[i].project + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].task + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].activity + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].hours + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].status + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].priority + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].difficulty + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].dependency + '<input type="hidden" id="tsDependencyId" value="' + data.timeSheetLine[i].dependencyId + '" />' + '<input type="hidden" id="tsProjectId" value="' + data.timeSheetLine[i].projectId + '" />' + '<input type="hidden" id="tsIssues" value="' + data.timeSheetLine[i].issues + '" />' + '<input type="hidden" id="tsResolutions" value="' + data.timeSheetLine[i].resolutions + '" />' + "</h6></td>" + "<td class='center'>" + '<i class="fa fa-pencil-square-o"        onclick="modifyRow(' + (i) + ')"></i>' + '<i class="fa fa-trash-o" id="Bttn_play" onclick="deleteRow(' + (i) + ')"></i> </td>' + "</tr>";
                    if (i > 0) $('.tableProjectTasks > tbody > tr').filter(":last").after(newRow);
                    else $('.tableProjectTasks > tbody').append(newRow);
                }
            }
        },
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
}

// addNewTimeSheet()
function saveTimeSheet() {
    if ($('#tsTask').val().length == 0) {
        alert("Enter task");
    } else if (($('#tsHours').val().length == 0)) {
        alert("Enter hours");
    } else if (($('#tsActivity').val().length == 0)) {
        alert("Enter activity");
    } else {
        var jsonObj = {};
        var jsonTimeSheetFormObj = {};
        var timeSheetLine = [];
        var dep = [];
        $('#tsDependency :selected').each(function(i, selected) {
            dep[i] = $(selected).text();
        });
        var y = dep;
        var removeItem = "None";
        y = jQuery.grep(y, function(value) {
            return value != removeItem;
        });
        jsonObj.hours = $("#tsHours").val();
        jsonObj.resolutions = $("#tsResolutions").val();
        jsonObj.issues = $("#tsIssues").val();
        jsonObj.activity = $("#tsActivity").val();
        jsonObj.task = $("#tsTask").val();
        jsonObj.status = $('#tsTaskStatus').find(":selected").text();
        jsonObj.priority = $('#tsPriority').find(":selected").text();
        jsonObj.difficulty = $('#tsDifficulty').find(":selected").text();
        jsonObj.dependency = y;
        jsonObj.project = $('#tsSelectProject').find(":selected").text();
        jsonObj.projectId = $('#tsSelectProject').find(":selected").val();
        timeSheetLine.push(jsonObj);
        jsonTimeSheetFormObj.date = $("#tsDate").val();
        jsonTimeSheetFormObj.timeSheetLine = timeSheetLine;
        $.ajax({
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "saveTimeSheet",
            async: false,
            dataType: 'json',
            data: JSON.stringify(jsonTimeSheetFormObj),
            success: function(data) {
                $("#tableProjectTasks").html(getTimesheet());
                $('#tsHours').val("");
                $('#tsIssues').val("");
                $('#tsResolutions').val("");
                $("#tsSelectProject").prop("disabled", false);
                $("#tsTask").val("").prop("disabled", false);
                $("#tsActivity").val("").prop("disabled", false);
            },
            error: function(xhr) {
                alert("An error occured: " + xhr.status + " " + xhr.statusText);
            }
        });
    }
}

// saveTimeSheet()
function onLoadDefaultTimeSheet() {
    if (GLOBAL_DATE === "START") {
        var today = new Date();
        GLOBAL_DATE = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate();
        $("#tsDate").val(GLOBAL_DATE);
    }
    $("#tsDate").val(GLOBAL_DATE);
    getTimesheet();
    var isVisible = $("#panel-collapse-5").is(":visible");
    // If Visible, make it Invisible
    if (isVisible) {}
    // Just reset the var  is in case the number has become too big
    // Ideally this never happens; But just in case...
    // Anyuser may logout and when he logs in, this mthod is definitely invoked
    // in such a scenario the following executes recycling the number
    if (GLOBAL_ROW_NUMBER > 123456) GLOBAL_ROW_NUMBER = 1001;
}

// onLoadDefaultTimesheet
// When the user clicks on ProjectEmployee image the following gets executed
// POPUP of Proecjt Employee details needs to be done here
$("a#projectEmp").click(function() {
    // Setting the ProjectId selected in the mainform (dashboard table with rows)
    // into the ProjectId in the popup;
    // We will use this Project Id for making an AJAX call
    var project_id = $(this).parent().parent().get(0);
    $("input#projectIdFromList").val(project_id.children[15].textContent);
    var projectId = $("#projectIdFromList").val();
    $("#popupProjectName").text(project_id.children[0].textContent);
    // We are making an AJAX call to get the list of CurrentEmployees for this project for display
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "GET",
        url: org_path + "getProject",
        async: false,
        dataType: 'json',
        data: {
            project: projectId
        },
        success: function(data) {
            var tEmployeeId = "";
            var tEmployeeName = "";
            var tEmployeeId1 = "";
            var tEmployeeName1 = "";
            $('#box1View').empty();
            for (var j = 0; j < data.cEmployeeList.length; j++) {
                tEmployeeName1 = data.cEmployeeList[j].firstName + " " +data.cEmployeeList[j].lastName;
                tEmployeeId1 = data.cEmployeeList[j].id;
                $('#box1View').append(new Option(tEmployeeName1, tEmployeeId1));
            }
            $('#box2View').empty();
            for (var i = 0; i < data.teamMembers.length; i++) {
                for (var j = 0; j < data.employeeList.length; j++) {
                    if (data.teamMembers[i].id == data.employeeList[j].id) {
                        tEmployeeName = data.employeeList[j].firstName +" "+ data.employeeList[j].lastName;
                        tEmployeeId = data.employeeList[j].id;
                    }
                }
                $('#box2View').append(new Option(tEmployeeName, tEmployeeId));
            }
            $.configureBoxes();
        },
        error: function(xhr) {
            alert("An error occured:" + xhr.status + " " + xhr.statusText);
        }
    });
});

function addEmployeeToProject() {
    var opts = $('#box2View')[0].options;
    var array = $.map(opts, function(elem) {
        return (elem.value || elem.text);
    });
    var jsonObj = {};
    jsonObj.empIds = array;
    jsonObj.projectId = $("#projectIdFromList").val();
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "POST",
        url: org_path + "employeeProjects",
        async: false,
        dataType: 'json',
        data: JSON.stringify(jsonObj),
        success: function(data) {
            window.location.reload();
        },
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
}

// updateProjectDetails()
function removeEmployeeFromProject(rowRefNum) {
    // Check for user confirmation
    var r = confirm("Do you really want to remove this Employee from Project");
    if (r != true) {
        return;
    }
    var tProjectId = $("#projectIdFromList").val();
    var tEmployeeId = $("#PN_R" + rowRefNum).val();
    var tRole = $("#ROLE_" + rowRefNum).text();
    var jsonObj = {};
    jsonObj.employeeId = tEmployeeId;
    jsonObj.projectId = tProjectId;
    jsonObj.roleInProject = tRole;
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "POST",
        url: "deleteEmployeeFromProject",
        async: false,
        dataType: 'json',
        data: JSON.stringify(jsonObj),
        success: function(data) {
            alert("Successfully deleted Employee from Project.");
            // DELETE the corresponding ROW from table
            $('table#tableCurrentEmployeeRoles  tr#R' + rowRefNum).remove();
        },
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
}

function viewReportTable() {
    var routputAs = $("#selectEmployee").val();
    var rprojectId = $("#selectProject").val();
    var remployeeId = $("#selectEmployee").val();
    var rstartDate = $("#startDate").val();
    var rendDate = $("#endDate").val();
    var rreportType = $("#reportType").val();
    alert(rreportType);
    var jsonObj = {};
    jsonObj.employeeId = remployeeId;
    jsonObj.projectId = rprojectId;
    jsonObj.startDate = rstartDate;
    jsonObj.endDate = rendDate;
    jsonObj.reportType = rreportType;
    jsonObj.outputAs = routputAs;
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "POST",
        url: "viewReportTable",
        async: false,
        dataType: 'json',
        data: JSON.stringify(jsonObj),
        success: function(data) {
            $("#tableProjectTasks tbody").find("tr").remove();
            for (var i = 0; i < data.timeSheetLine.length; i++) {
                newRow = '<tr class="odd gradeX"  ' + 'id="ROW_' + (i) + '">' + "<td class='center'><h6>" + data.timeSheetLine[i].project + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].task + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].activity + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].hours + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].status + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].priority + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].difficulty + "</h6></td>" + "<td class='center'><h6>" + data.timeSheetLine[i].dependency + '<input type="hidden" id="tsDependencyId" value="' + data.timeSheetLine[i].dependencyId + '" />' + '<input type="hidden" id="tsProjectId" value="' + data.timeSheetLine[i].projectId + '" />' + '<input type="hidden" id="tsIssues" value="' + data.timeSheetLine[i].issues + '" />' + '<input type="hidden" id="tsResolutions" value="' + data.timeSheetLine[i].resolutions + '" />' + "</h6></td>" + "</tr>";
                if (i > 0) $('#tableProjectTasks > tbody > tr').filter(":last").after(newRow);
                else $('#tableProjectTasks > tbody').append(newRow);
            }
        },
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
}

$("img#editProject").click(function() {
    var project_id = $(this).parent().parent().get(0);
    $("input#id.projectId").val(project_id.children[16].textContent);
    var projectId = $(".projectId").val();
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "GET",
        url: "getProjectForm",
        async: false,
        dataType: 'json',
        data: {
            project: projectId
        },
        success: function(data) {
            $(".projectData").find(".project_name").val(data.project.name);
            $(".projectData").find(".project_stack").val(data.project.technologyStack);
            $(".projectData").find("#project_startdate").val(data.project.startDate);
            $(".projectData").find("#project_enddate").val(data.project.endDate);
            $(".projectData").find(".project_contact_name").val(data.project.primaryManager);
            $(".projectData").find(".project_email").val(data.project.primaryContactEmail);
            $(".projectData").find(".project_client").val(data.project.client);
            $(".projectData").find(".project_docrepo").val(data.project.projectDocRepo);
            $(".projectData").find(".project_sourcerepo").val(data.project.projectSourceRepo);
            $(".projectData").find(".project_duration").val(data.project.duration);
            $(".projectData").find(".project_cost").val(data.project.costEstimate);
            $(".projectData").find(".project_stream").val(data.project.projectStream);
            $(".projectData").find(".project_status").val(data.project.status);
            if (data.project.projectActive) {
                $(".projectData").find("#status_Active").prop('checked', true);
            } else {
                $(".projectData").find("#status_inActive").prop('checked', true);
            }
            $('#selectProjectLead').val(data.project.projectLeadId);
        },
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});

function generateReport(outputAs) {
    $("#inputOutputAs").val(outputAs);
    $("#reportType").val(outputAs);
}

$("#addDesig").click(function() {
    $("#showDesig").show();
});

$("#imgId").click(function() {
    if ($("#Text1").val().length == 0) {
        alert("Enter value");
        $("#Text1").focus();
    } else if ($("#Text1").val().length > 0) {
        $('#employee_Designations').prepend($("<option selected='selected'>" + $('#Text1').val() + "</option>"));
        $("#showDesig").hide();
    }
});

$("#getPaySlip").click(function() {
    $("#generatePaySlip").show();
});

function editLeave(leaveId, fromDate, toDate, typeId, subject, message, createdDate) {
	$("#id").val(leaveId);
    $("#fromDate").val(fromDate);
    $("#toDate").val(toDate);
    $("#leaveType").val(typeId);
    $("#subject").val(subject);
    $("#message").val(message);
    $("#btnSave").html("Update");
} // modifyRow

function getEmployeeProjects() {
    $.ajax({
        type: "GET",
        url: org_path + "getEmployeeProjects",
        data: {},
        success: function(data) {
            $('#tsSelectProject1').empty();
            $('#tsSelectProject2').empty();
            $('#tsSelectProject3').empty();
            $('#tsSelectProject4').empty();
            for (var i = 0; i < data.length; i++) {
                $('#tsSelectProject1').append(new Option(data[i].name, data[i].id));
                $('#tsSelectProject2').append(new Option(data[i].name, data[i].id));
                $('#tsSelectProject3').append(new Option(data[i].name, data[i].id));
                $('#tsSelectProject4').append(new Option(data[i].name, data[i].id));
            }
            $('#tsSelectProject1').prepend(new Option("-- Select --", ""));
            $('#tsSelectProject2').prepend("<option value=''>-- Select --</option>").val('');
            $('#tsSelectProject3').prepend("<option value=''>-- Select --</option>").val('');
            $('#tsSelectProject4').prepend("<option value=''>-- Select --</option>").val('');
        },
        error: function(result) {
            alert("An error occured: " + result.status + " " + result.statusText);
        }
    });
}

$("#tsSelectProject1").change(function() {
    var projectId = this.value;
    if (projectId != '') {
        SELECTED_PROJECT = this.id;
        DEPENDENCY = "#tsDependency1";
        loadTeamMembers(projectId);
    } else {
        $('#tsDependency1').empty();
        $('#tsDependency1').prepend(new Option("-- Select --", ""));
    }
});

$("#tsSelectProject2").change(function() {
    var projectId = this.value;
    if (projectId != '') {
        SELECTED_PROJECT = this.id;
        DEPENDENCY = "#tsDependency2";
        loadTeamMembers(projectId);
    } else {
        $('#tsDependency2').empty();
        $('#tsDependency2').prepend(new Option("-- Select --", ""));
    }
});

$("#tsSelectProject3").change(function() {
    var projectId = this.value;
    if (projectId != '') {
        SELECTED_PROJECT = this.id;
        DEPENDENCY = "#tsDependency3";
        loadTeamMembers(projectId);
        loadCompletedFeatures(projectId);
    } else {
        $('#tsDependency3').empty();
        $('#tsDependency3').prepend(new Option("-- Select --", ""));
    }
});

$("#tsSelectProject4").change(function() {
    var projectId = this.value;
    if (projectId != '') {
        SELECTED_PROJECT = this.id;
        DEPENDENCY = "#tsDependency4";
        loadTeamMembers(projectId);
    } else {
        $('#tsDependency4').empty();
        $('#tsDependency4').prepend(new Option("-- Select --", ""));
    }
});

function loadTeamMembers(projectId) {
    var dependency = DEPENDENCY;
    $.ajax({
        type: "GET",
        url: "getTeamMembers",
        data: {
            "projectId": projectId
        },
        success: function(data) {
            $(dependency).empty();
            for (var i = 0; i < data.length; i++) {
            	$(dependency).append(new Option(data[i].name, data[i].id));
            }
            if (dependency == "#chooseEmployeeId" || dependency == "#selectEmployeeId") {
                $(dependency).prepend(new Option("All Employees", "all_employees"));
            } else {
                $(dependency).prepend(new Option("-- Select --", ""));
            }
        },
        error: function(result) {
            alert("An error occured: " + result.status + " " + result.statusText);
        }
    });
}

function getProjectTasks(type, projectId) {
    $.ajax({
        type: "GET",
        url: "getTasks",
        data: {
            "type": type,
            "projectId": projectId
        },
        success: function(data) {
            window.location.href = org_path + "activitiesList";
        },
        error: function(result) {
            alert("An error occured: " + result.status + " " + result.statusText);
        }
    });
}

function getTaskDetails(taskId) {
    $.ajax({
        type: "GET",
        url: "getTaskDetails",
        data: {
            "taskId": taskId
        },
        success: function(data) {
            $("label#popupProjectName").text(data.projectName);
            $("label#popupTaskName").text(data.name);
            $("textarea#popupTaskDescription").text(data.description);
            $("label#popupTaskPriority").text(data.priority);
            $("label#popupTaskAssignedBy").text(data.employeeName);
            $("label#popupTaskType").text(data.type);
            $("label#popupTaskStartDate").text(data.startDate);
            $("input#popupTaskId").val(data.id);
            $("input#popupTaskStatus").val(data.status);
            $("label#popupTaskEndDate").text(data.endDate);
            $("label#popupTaskTimeSpent").text(data.hoursSpent);
            if (data.status != null && data.status == "completed") {
                $("#submitApprove").hide();
                $("#popupTaskEndDate").show();
                $("#popupTaskTimeSpent").show();
            } else if (data.status != null && data.status == "accepted") {
                $("#submitApprove").hide();
                $("#popupTaskEndDate").show();
                $("#popupTaskTimeSpent").show();
            } else if (data.type != null && data.type == "task") {
                $("#submitApprove").hide();
                $("#popupTaskEndDate").hide();
                $("#popupTaskTimeSpent").hide();
            } else if (data.status != null && data.status == "paused") {
                $("#submitApprove").text("Resume");
                $("#popupTaskEndDate").hide();
                $("#popupTaskTimeSpent").hide();
            } else if (data.status != null && data.status == "inprogress") {
                $("#submitApprove").text("Complete");
                $("#popupTaskEndDate").hide();
                $("#popupTaskTimeSpent").hide();
            } else if (data.status != null && data.status == "pending") {
                $("#submitApprove").text("Start");
                $("#popupTaskEndDate").hide();
                $("#popupTaskTimeSpent").hide();
            }
        },
        error: function(result) {
            alert("An error occured: " + result.status + " " + result.statusText);
        }
    });
}

$("#selectProjectId").change(function() {
    var projectId = this.value;
    if (projectId != 'all_projects') {
        SELECTED_PROJECT = this.id;
        DEPENDENCY = "#selectEmployeeId";
        loadTeamMembers(projectId);
    } else {
    	 $("#selectEmployeeId").empty();
    	var allManagerEmployees = $('#allManagerEmployees')[0].options;
    	$.map(allManagerEmployees, function(elem) {
    		$("#selectEmployeeId").append(new Option(elem.text, elem.value));    
    	});
    	$("#selectEmployeeId").prepend(new Option("All Employees", "all_employees"));
    }
});

$("#chooseProjectId").change(function() {
    var projectId = this.value;
    SELECTED_PROJECT = this.id;
    DEPENDENCY = "#chooseEmployeeId";
    loadTeamMembers(projectId);
});

$("#pickProjectId").change(function() {
    var projectId = this.value;
    SELECTED_PROJECT = this.id;
    DEPENDENCY = "#chooseEmployeeId";
    loadTeamMembersForTimeSheet(projectId);
});

function loadSelectedProjectMembers() {
    var projectId = $("#chooseProjectId").val();
    SELECTED_PROJECT = this.id;
    DEPENDENCY = "#chooseEmployeeId";
    loadTeamMembers(projectId);
}
var responseMsg = $(".success-rpassword").text();
if (responseMsg.length != null) {
    $('.reset-password').val('');
}
var role = $("#role option:selected").text();
if (role == 'Admin') {
    $("#roleDiv").hide();
}

$("#addDesignation").click(function() {
    var designationName = $("input#designationName").val();
    if (designationName.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "addDesignation",
            data: {
                "designationName": designationName
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#designationSuccess").hide();
                    $("label#designationError").show();
                    $("input#designationName").val('');
                    $("label#designationError").text("Designaton already exists");
                } else if (data == 'success') {
                    $("label#designationError").hide();
                    $("label#designationSuccess").show();
                    $("input#designationName").val('');
                    $("label#designationSuccess").text("Designaton added successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#designationError").text("Please enter designation");
    }
});

$("#addRole").click(function() {
    var roleName = $("input#roleName").val();
    if (roleName.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "addRole",
            data: {
                "roleName": roleName
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("#roleSuccess").hide();
                    $("#roleError").show();
                    $("input#roleName").val('');
                    $("#roleError").text("Role already exists");
                } else if (data == 'success') {
                    $("#roleError").hide();
                    $("#roleSuccess").show();
                    $("#roleName").val('');
                    $("#roleSuccess").text("Role added successfully");
                     window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#roleError").text("Please enter role");
    }
});

$("#addStream").click(function() {
    var streamName = $("input#streamName").val();
    if (streamName.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "addStream",
            data: {
                "streamName": streamName
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#streamSuccess").hide();
                    $("ladel#streamError").show();
                    $("input#streamName").val('');
                    $("label#streamError").text("Stream already exists");
                } else if (data == 'success') {
                    $("label#streamError").hide();
                    $("label#streamSuccess").show();
                    $("input#streamName").val('');
                    $("label#streamSuccess").text("Stream added successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            erroe: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#streamError").text("Please enter stream");
    }
});

//delete mannual_task  entry
function deleteTimeSheetEntry(taskId) {
    $.confirm({
        text: "Are you sure you want to delete ?",
        confirm: function() {
            deleteTask(taskId);
        },
        cancel: function() {}
    });
}

function deleteTask(taskId) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteTimeSheetEntry",
        data: {
            "taskId": taskId
        },
        success: function(data) {
            window.location.href = org_path + "dashboard";
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}
//Delete Calendar Entry
function deleteCalendarEntry() {
    $.confirm({
        text: "Are you sure you want to delete ?",
        confirm: function() {
            var eventId = $('#eventId').text();
            deleteCalendarEvent(eventId);
        },
        cancel: function() {}
    });
}

function editCalendarEntry() {
    var dateFormat = $("input#dateFormat").val();
    var newFormat = dateFormat.toUpperCase();
    $('#calendarDatepicker1').datetimepicker({
        format: newFormat
    });
    $('#fullCalModal').modal('hide');
    var eventId = $('#eventId').text();
    var eventDate = $('#eventDate').text();
    var eventTypeId = $('#eventTypeId').text();
    var eventTitle = $('#eventTitle').text();
    var eventDescription = $('#eventInfo').text();
    var eventCreatedDate = $('#eventCreatedDate').text();
    var createdBy = $('#createdBy').text();


    // var eventVisibility = $('#eventVisibleTo').text();
    var projectId = $('#projId').text();
    var orgId = $('#orgId').text();
    $("#editEventId").val(eventId);
    $("#editEventDate").val(eventDate);
    $("#editEventCreatedDate").val(eventCreatedDate);
    $("#editEventCreatedBy").val(createdBy);
    $("#editEventTypeId").val(eventTypeId);
    $("#editEventTitle").val(eventTitle);
    $("#editEventDescription").val(eventDescription);
    $("#editEventType").val(eventTypeId);
    $("#editEventProjectId").val(projectId);
    $("#edit_projectId").val(projectId);
    $("#edit_visibleToOrg").val(orgId);
    $("#edit_eventType").val(eventType);
    $('#Modal-EditEvent').modal('show');
}

function deleteCalendarEvent(eventId) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteCalendarEntry",
        data: {
            "eventId": eventId
        },
        success: function(data) {
            window.location.href = org_path + "calendar";
        },
        error: function(result) {
            alert("An error occured: " + result.status + " " + result.statusText);
        }
    });
}

$("a#taskDetails").click(function() {
    var rowObj = $(this).parent().parent().get(0);
    $("label#taskId").text(rowObj.children[0].textContent);
    var taskId = $("#taskId").text();
    $.ajax({
        type: "GET",
        url: org_path + "getTaskDetails",
        data: {
            "taskId": taskId
        },
        success: function(data) {
            $("p#projectName").text(data.projectName);
            $("textarea#taskName").text(data.name);
            $("textarea#taskDescription").val(data.description);
            $("p#taskPriority").text(data.priority);
            $("p#taskType").text(data.type);
            $("p#taskAssignedBy").text(data.employeeName);
            $("p#taskStatus").text(data.status);
            $("p#taskCreatedDate").text(data.createdDate);
            $("p#taskDate").text(data.date);
            $("p#taskTimeSpent").text(data.hoursSpent);
            $('#DefaultModal3').modal();
        },
        error: function(result) {
            alert("An error occured: " + result.status + " " + result.statusText);
        }
    });
});

function sendPaySlips(data) {
    $.ajax({
        type: "POST",
        url: org_path + "sendPaySlips",
        data: {
            "paySlipInfo": data
        },
        success: function(response) {
            if (response == 'success') {
                $("span#successMessage").text('Payslip\'s sent successfully.');
            } else {
                $("span#errorMessage").text('Something went wrong while sending payslip\'s.');
            }
        },
        error: function(result) {
            alert("An error occured: " + result.status + " " + result.statusText);
        }
    });
}

function savePaySlips(data) {
    $.ajax({
        type: "POST",
        url: org_path + "savePaySlips",
        data: {
            "paySlipInfo": data
        },
        success: function(response) {
            if (response == 'success') {
                $("span#successMessage").text('Payslip\'s saved successfully.');
            } else {
                $("span#errorMessage").text('Something went wrong while saving payslip\'s.');
            }
        },
        error: function(result) {
            alert("An error occured: " + result.status + " " + result.statusText);
        }
    });
}

//Change Password Validations
$('#changePassword').formValidation({
    feedbackIcons: {

    },
    fields: {
        oldPassword: {
            validators: {
                notEmpty: {
                    message: 'The old password is required.'
                }
            }
        },
        reenterPassword: {
            validators: {
                notEmpty: {
                    message: 'The confirm password is required.'
                },
                identical: {
                    field: 'newPassword',
                    message: 'The password and confirm password are not same.'
                }
            }
        }
    }
});

function viewDependencies(dependents) {
    $("p#dependencyNames").text(dependents);
}

function generateDynamicPaySlipExcel(type) {
	
    var detailsbox2View = $('#detailsbox2View')[0].options;
    var detailsArray = $.map(detailsbox2View, function(elem) {
        return (elem.value || elem.text);
    });

    var earningsbox2View = $('#earningsbox2View')[0].options;
    var earningsArray = $.map(earningsbox2View, function(elem) {
        return (elem.value || elem.text);
    });

    var deductionsbox2View = $('#deductionsbox2View')[0].options;
    var deductionsArray = $.map(deductionsbox2View, function(elem) {
        return (elem.value || elem.text);
    });

    var totalsbox2View = $('#totalsbox2View')[0].options;
    var totalsArray = $.map(totalsbox2View, function(elem) {
        return (elem.value || elem.text);
    });

    var hr_email = $("input#hr_email").val();
    
    var jsonObj = {};
    jsonObj.hrEmail = hr_email;
    jsonObj.employeeDetails = detailsArray;
    jsonObj.earnings = earningsArray;
    jsonObj.deductions = deductionsArray;
    jsonObj.calculations = totalsArray;

    console.log(JSON.stringify(jsonObj));
    if (type == 'save') {
    	$("#columns_save").val(JSON.stringify(jsonObj));
    } else {
    	$("#columns").val(JSON.stringify(jsonObj));
    }
}

$("#addTaskPriority").click(function() {
    var taskPriorityName = $("input#taskPriorityName").val();
    if (taskPriorityName.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "addTaskPriority",
            data: {
                "taskPriorityName": taskPriorityName
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#taskPrioritySuccess").hide();
                    $("label#taskPriorityError").show();
                    $("input#taskPriorityName").val('');
                    $("label#taskPriorityError").text("Task priority already exists");
                } else if (data == 'success') {
                    $("label#taskPriorityError").hide();
                    $("label#taskPrioritySuccess").show();
                    $("input#taskPriorityName").val('');
                    $("label#taskPrioritySuccess").text("Task priority added successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#taskPriorityError").text("Please enter task Priority");
    }
});
$("#addTaskStatus").click(function() {
    var taskStatusName = $("input#taskStatusName").val();
    if (taskStatusName.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "addTaskStatus",
            data: {
                "taskStatusName": taskStatusName
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#taskStatusSuccess").hide();
                    $("label#taskStatusError").show();
                    $("input#taskStatusName").val('');
                    $("label#taskStatusError").text("Task status already exists");
                } else if (data == 'success') {
                    $("label#taskStatusError").hide();
                    $("label#taskStatusSuccess").show();
                    $("input#taskStatusName").val('');
                    $("label#taskStatusSuccess").text("Task status added successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#taskStatusError").text("Please enter task Status");
    }
});

function handleDateForamt() {
    var dateFormat = $("input#dateFormat").val();
    var newFormat = dateFormat.toUpperCase();
    if ($("input#dueDays").val() != '' && $("input#dueDays").val() != '0') {
        var minTsDate = new Date();
        minTsDate.setDate(minTsDate.getDate() - $("input#dueDays").val())
        $('#datepicker1').datetimepicker({
            format: newFormat,
            maxDate: 'now',
            minDate: minTsDate,
            ignoreReadonly: true
        })
         } else {
        $('#datepicker1').datetimepicker({
            format: newFormat,
            maxDate: 'now',
            ignoreReadonly: true
        })
    }
   
    $('#timesheet_report_datepicker1').datetimepicker({
        format: newFormat,
        maxDate: 'now',
        ignoreReadonly: true
    });
    $('#timesheet_report_datepicker2').datetimepicker({
        format: newFormat,
        maxDate: 'now',
        ignoreReadonly: true
    });

    $("#timesheet_report_datepicker1").on("dp.change", function(e) {
        $('#timesheet_report_datepicker2').data("DateTimePicker").minDate(e.date);
    });
    $("#timesheet_report_datepicker2").on("dp.change", function(e) {
        $('#timesheet_report_datepicker1').data("DateTimePicker").maxDate(e.date);
    });
 
   $('#employee_DOB_datePicker').datetimepicker({
        format: newFormat,
        ignoreReadonly:true,
        maxDate: 'now',
    });
   $("#employee_DOB_datePicker").on("dp.change", function(e) {
		$('#addEmployee').formValidation('revalidateField', 'dateOfBirth');
   });

    
   $('#employee_DOj_datePicker').datetimepicker({
        format: newFormat,
        ignoreReadonly:true,
        maxDate: 'now',
    });
   $("#employee_DOj_datePicker").on("dp.change", function(e) {
		$('#addEmployee').formValidation('revalidateField', 'dateOfJoining');
   });

    $('#project_startdate_datePicker').datetimepicker({
        format: newFormat,
        ignoreReadonly:true
    });

    $('#project_enddate_datePicker').datetimepicker({
        format: newFormat,
        ignoreReadonly:true
    });

    $("#project_startdate_datePicker").on("dp.change", function(e) {
        $('#project_enddate_datePicker').data("DateTimePicker").minDate(e.date);
    });

    $("#project_enddate_datePicker").on("dp.change", function(e) {
        $('#project_startdate_datePicker').data("DateTimePicker").maxDate(e.date);
    });

    $('#notificationdatepicker1').datetimepicker({
        format: newFormat
    });

    $('#notificationdatepicker2').datetimepicker({
        format: newFormat
    });

    $("#notificationdatepicker1").on("dp.change", function(e) {
        $('#notificationdatepicker2').data("DateTimePicker").minDate(e.date);
    });

    $("#notificationdatepicker2").on("dp.change", function(e) {
        $('#notificationdatepicker1').data("DateTimePicker").maxDate(e.date);
    });

    $('#createdDate').datetimepicker({
        format: newFormat
    });

    $('#createdDate').on('changeDate', function(ev) {
        if (ev.viewMode === 'days') {
            $(this).datepicker('hide');
        }
    });

    $('#calendarDatepicker').datetimepicker({
        format: newFormat
    });

    $('#calendarDatepicker').on('changeDate', function(ev) {
        if (ev.viewMode === 'days') {
            $(this).datepicker('hide');
        }
    });
    
    $('#emp_prj_datepicker1').datetimepicker({
        format: newFormat,
        ignoreReadonly:true
    });

    $('#emp_prj_datepicker2').datetimepicker({
        format: newFormat,
        ignoreReadonly:true
    });

}

function deleteNotificationEntry(id) {
    $.confirm({
        text: "Are you sure you want to delete ?",
        confirm: function() {
            deleteNotification(id);
        },
        cancel: function() {}
    });
}

function deleteNotification(id) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteNotificationEntry",
        data: {
            "id": id
        },
        success: function(data) {
            window.location.href = org_path + data;
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}

function deleteClientEntry(id) {
    $.confirm({
        text: "Are you sure you want to delete ?",
        confirm: function() {
            deleteClient(id);
        },
        cancel: function() {}
    });
}

function deleteClient(id) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteClientEntry",
        data: {
            "id": id
        },
        success: function(data) {
            window.location.href = org_path + data;
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}

$("#addTaskType").click(function() {
    var taskTypeName = $("input#taskTypeName").val();
    if (taskTypeName.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "addTaskType",
            data: {
                "taskTypeName": taskTypeName
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#taskTypeSuccess").hide();
                    $("label#taskTypeError").show();
                    $("input#taskTypeName").val('');
                    $("label#taskTypeError").text("Task Type already exists");
                } else if (data == 'success') {
                    $("label#taskTypeError").hide();
                    $("label#taskTypeSuccess").show();
                    $("input#taskTypeName").val('');
                    $("label#taskTypeSuccess").text("Task Type added successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#taskTypeError").text("Please Enter Task Type");
    }
});

$("#addLeaveType").click(function() {
    var leaveTypeName = $("input#leaveTypeName").val();
    if (leaveTypeName.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "addLeaveType",
            data: {
                "leaveTypeName": leaveTypeName
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#leaveTypeSuccess").hide();
                    $("label#leaveTypeError").show();
                    $("input#leaveTypeName").val('');
                    $("label#leaveTypeError").text("Leave type already exists");
                } else if (data == 'success') {
                    $("label#leaveTypeError").hide();
                    $("label#leaveTypeSuccess").show();
                    $("input#leaveTypeName").val('');
                    $("label#leaveTypeSuccess").text("Leave type added successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#leaveTypeError").text("Please enter leave type");
    }
});

function updateNotificationStatus(notificationId) {
    $.ajax({
        type: "POST",
        url: org_path + "updateNotificationStatus",
        data: {
            "notificationId": notificationId
        },
        success: function(data) {
            $.ajax({
                type: "GET",
                url: org_path + "getNotificationDetails",
                data: {
                    "notificationId": notificationId
                },
                success: function(data) {
                    $("p#name").text(data.name);
                    $("textarea#description").text(data.description);
                    $("p#type").text(data.type);
                    $("p#fromDate").text(data.fromDate);
                    $("p#toDate").text(data.toDate);
                },
                error: function(result) {
                    alert("An error occured: " + result.status + " " + result.statusText);
                }
            });
        },
        error: function(result) {
            alert("An error occured: " + result.status + " " + result.statusText);
        }
    });
}

function planSelection(id) {
    $("input#orgPlan").val(id);
    var optionselected = $('#choosesubscriptionType option:selected').val();
    $("input#subscriptionType").val(optionselected);
}



$("a#orgDetails").click(function() {
    var rowObj = $(this).parent().parent().get(0);
    $("input#orgId").val(rowObj.children[7].textContent);
    $("#popupOrgName").text(rowObj.children[0].textContent);
    var orgId = $("#orgId").val();
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        type: "GET",
        url: org_path + "getOrganization",
        async: false,
        dataType: 'json',
        data: {
            orgId: orgId
        },
        success: function(data) {
            $("#orgData").find("#orgName").text(data.name);
            $("#orgData").find("#orgEmail").text(data.email);
            $("#orgData").find("#orgOwnerName").text(data.ownerName);
            $("#orgData").find("#orgUrl").text(data.url);
            $("#orgData").find("#noOfEmployees").text(data.size);
            $("#orgData").find("#createdDate").text(data.createdDate);
            $("#orgData").find("#licenseStatus").text(data.licenseStatus);
            $("#orgData").find("#expiryDate").text(data.expiryDate);
            $("#orgData").find("#licenseCost").text(data.licenseCost);
            $("#orgData").find("#orgPlan").text(data.orgPlan);
            $("#orgData").find("#companyCode").text(data.orgCode);
        },
        error: function(xhr) {
            alert("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
});

//delete mannual_task  entry
function changeOrgStatus(orgId) {
    $.confirm({
        text: "Are you sure you want to Change this Organization Status?",
        confirm: function() {
            changeStatus(orgId);
        },
        cancel: function() {}
    });
}

function changeStatus(orgId) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteOrg",
        data: {
            "orgId": orgId
        },
        success: function(data) {
            window.location.href = org_path + "dashboard";
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}
$("#addEventType").click(function() {

    var eventTypeName = $("input#eventTypeName").val();
    if (eventTypeName.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "addEventType",
            data: {
                "eventTypeName": eventTypeName
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#eventTypeSuccess").hide();
                    $("label#eventTypeError").show();
                    $("input#eventTypeName").val('');
                    $("label#eventTypeError").text("Event type already exists");
                } else if (data == 'success') {
                    $("label#eventTypeError").hide();
                    $("label#eventTypeSuccess").show();
                    $("input#eventTypeName").val('');
                    $("label#eventTypeSuccess").text("Event type added successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#eventTypeError").text("Please enter event Type");
    }
});

function loadTeamMembersForTimeSheet(projectId) {
	    var dependency = DEPENDENCY;
	    $(dependency).trigger("chosen:updated");
	    if (projectId == "") {
	        $(dependency).empty();
	    } else {
	        $.ajax({
	            type: "GET",
	            url: "getTeamMembers",
	            data: {
	                "projectId": projectId
	            },
	            success: function(data) {
	                $(dependency).empty();
	                /*$(dependency).append(new Option("", ""));*/
	                $(dependency).trigger("chosen:updated");
	
	                for (var i = 0; i < data.length; i++) {
	                    $(dependency).append(new Option(data[i].name, data[i].id));
	                    $(dependency).val(data[i].name).trigger("chosen:updated");
	                }
	            },
	            error: function(result) {
	               // alert("An error occured: " + result.status + " " + result.statusText);
	            }
	        });
    }
}

$("#addProjectStatus").click(function() {
    var projectStatusName = $("input#projectStatusName").val();
    if (projectStatusName.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "addProjectStatus",
            data: {
                "projectStatusName": projectStatusName
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#projectStatusSuccess").hide();
                    $("label#projectStatusError").show();
                    $("input#projectStatusName").val('');
                    $("label#projectStatusError").text("Project status already exists");
                } else if (data == 'success') {
                    $("label#projectStatusError").hide();
                    $("label#projectStatusSuccess").show();
                    $("input#projectStatusName").val('');
                    $("label#projectStatusSuccess").text("Project status added successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("#projectStatusError").text("Please enter project status");
    }
});


var config = {
    '.chosen-select': {},
    '.chosen-select-deselect': {
        allow_single_deselect: true
    },
    '.chosen-select-no-single': {
        disable_search_threshold: 10
    },
    '.chosen-select-no-results': {
        no_results_text: 'Oops, nothing found!'
    },
    '.chosen-select-width': {
        width: "95%"
    }
}
for (var selector in config) {
    $(selector).chosen(config[selector]);
}


function downloadGeneratePaySLip() {
    $("#info_msg").html("It seems you don't have any payroll excel file generated, got to payroll settings and generate your payslip file to view this.");
}


//delete role  entry
function confirmDeleteRole(role) {
    $.confirm({
        text: "Are you sure you want to delete ?",
        confirm: function() {
            deleteRole(role);
        },
        cancel: function() {}
    });
}

function deleteRole(role) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteRole",
        data: {
            "roleId": role
        },
        success: function(data) {
            window.location.href = org_path + "settings";
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}

//delete designation  entry
function confirmDeleteDesignation(desig) {
    $.confirm({
        text: "Are you sure you want to delete ?",
        confirm: function() {
            deleteDesignation(desig);
        },
        cancel: function() {}
    });
}

function deleteDesignation(desig) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteDesignation",
        data: {
            "designationId": desig
        },
        success: function(data) {
            window.location.href = org_path + "settings";
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}


//delete designation  entry
function confirmDeleteStream(stream) {
    $.confirm({
        text: "Are you sure you want to delete ?",
        confirm: function() {
            deleteStream(stream);
        },
        cancel: function() {}
    });
}

function deleteStream(stream) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteStream",
        data: {
            "streamId": stream
        },
        success: function(data) {
            window.location.href = org_path + "settings";
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}

//delete task proirty  entry
function confirmDeleteTaskPriority(taskPriority) {
    $.confirm({
        text: "Are you sure you want to delete ?",
        confirm: function() {
            deleteTaskPrioity(taskPriority);
        },
        cancel: function() {}
    });
}

function deleteTaskPrioity(taskPriority) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteTaskPriority",
        data: {
            "taskPriorityId": taskPriority
        },
        success: function(data) {
            window.location.href = org_path + "settings";
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}

//delete task status  entry
function confirmDeleteTaskStatus(taskStatus) {
    $.confirm({
        text: "Are you sure you want to delete ?",
        confirm: function() {
            deleteTaskStatus(taskStatus);
        },
        cancel: function() {}
    });
}

function deleteTaskStatus(taskStatus) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteTaskStatus",
        data: {
            "taskStatusId": taskStatus
        },
        success: function(data) {
            window.location.href = org_path + "settings";
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}

//delete task type  entry
function confirmDeleteTaskType(taskType) {
    $.confirm({
        text: "Are you sure you want to delete ?",
        confirm: function() {
            deleteTaskType(taskType);
        },
        cancel: function() {}
    });
}

function deleteTaskType(taskType) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteTaskType",
        data: {
            "taskTypeId": taskType
        },
        success: function(data) {
            window.location.href = org_path + "settings";
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}

//delete leave type  entry
function confirmDeleteLeaveType(leaveType) {
    $.confirm({
        text: "Are you sure you want to delete ?",
        confirm: function() {
            deleteLeaveType(leaveType);
        },
        cancel: function() {}
    });
}

function deleteLeaveType(leaveType) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteLeaveType",
        data: {
            "leaveTypeId": leaveType
        },
        success: function(data) {
            window.location.href = org_path + "settings";
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}

//delete event type  entry
function confirmDeleteEventType(eventType) {
    $.confirm({
        text: "Are you sure you want to delete ?",
        confirm: function() {
            deleteEventType(eventType);
        },
        cancel: function() {}
    });
}

function deleteEventType(eventType) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteEventType",
        data: {
            "eventTypeId": eventType
        },
        success: function(data) {
            window.location.href = org_path + "settings";
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}

//delete project status  entry
function confirmDeleteProjectStatus(projectStatus) {
    $.confirm({
        text: "Are you sure you want to delete ?",
        cancel: function() {},
        confirm: function() {
            deleteProjectStatus(projectStatus);
        }
    });
}

function deleteProjectStatus(projectStatus) {
    $.ajax({
        type: "POST",
        url: org_path + "deleteProjectStatus",
        data: {
            "projectStatusId": projectStatus
        },
        success: function(data) {
            window.location.href = org_path + "settings";
        },
        error: function(result) {
            alert("An error occured:v " + result.status + " " + result.statusText);
        }
    });
}

//edit task status  entry
function editTaskStatus(key, value) {
    $('#editTaskStatusName').val(value);
    $('#editTaskStatusId').val(key);
}

//update task status 
$("#updateTaskStatus").click(function() {
    var taskStatusName = $("input#editTaskStatusName").val();
    var taskStatusId = $("input#editTaskStatusId").val();
    if (taskStatusName.length != 0 && taskStatusId.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "updateTaskStatus",
            data: {
                "taskStatusName": taskStatusName,
                "taskStatusId": taskStatusId
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#taskStatusSuccess").hide();
                    $("label#taskStatusError").show();
                    $("input#taskStatusName").val('');
                    $("label#taskStatusError").text("Task Status already exists");
                } else if (data == 'success') {
                    $("label#taskStatusError").hide();
                    $("label#taskStatusSuccess").show();
                    $("input#taskStatusName").val('');
                    $("label#taskStatusSuccess").text("Task Status updated successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#taskStatusError").text("Please Enter Task Status");
    }
});

$("#payslip_year").change(function() {
    var year = this.value;
    var dependency = "#payslip_month";
    if (year == "") {
        $(dependency).empty();
    } else {
        $.ajax({
            type: "GET",
            url: "getPayslipMonthsByYear",
            data: {
                "year": year
            },
            success: function(data) {
                $(dependency).empty();

                $(dependency).append(new Option("-- Select --", ""));
                $(dependency).trigger("chosen:updated");

                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    $(dependency).append(new Option(data[i], data[i]));
                    $(dependency).trigger("chosen:updated");
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    }
});

//message 
window.setTimeout(function() {
    $("#info_message").fadeTo(500, 0).slideUp(500, function() {
        $(this).remove();
    });
}, 20000);

//settings
window.setTimeout(function() {
    $("#roleSuccess").fadeTo(500, 0).slideUp(500, function() {
        $(this).remove();
    });
}, 7000);

//edit Designation  entry
function editDesignation(key, value) {
    $('#editDesignationId').val(key);
    $('#editDesignationName').val(value);
}

//update Designation  entry
$("#updateDesignation").click(function() {
    var designationName = $("input#editDesignationName").val();
    var designationId = $("input#editDesignationId").val();
    if (designationName.length != 0 && designationId.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "updateDesignation",
            data: {
                "designationName": designationName,
                "designationId": designationId
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#designationSuccess").hide();
                    $("label#designationError").show();
                    $("input#designationName").val('');
                    $("label#designationError").text("Designaton already exists");
                } else if (data == 'success') {
                    $("label#designationError").hide();
                    $("label#designationSuccess").show();
                    $("input#designationName").val('');
                    $("label#designationSuccess").text("Designaton updated successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#designationError").text("Please Enter Designation");
    }
});

//edit Role  entry
function editRole(key, value) {
    $('#editRoleId').val(key);
    $('#editRoleName').val(value);
}

//update Role  entry
$("#updateRole").click(function() {
    var roleName = $("input#editRoleName").val();
    var roleId = $("input#editRoleId").val();
    if (roleName.length != 0 && roleId.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "updateRole",
            data: {
                "roleName": roleName,
                "roleId": roleId
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#roleSuccess").hide();
                    $("label#roleError").show();
                    $("input#roleName").val('');
                    $("label#roleError").text("Role already exists");
                } else if (data == 'success') {
                    $("label#roleError").hide();
                    $("label#roleSuccess").show();
                    $("input#roleName").val('');
                    $("label#roleSuccess").text("Role updated successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#roleError").text("Please Enter Role");
    }
});

//edit Stream  entry
function editStream(key, value) {
    $('#editStreamId').val(key);
    $('#editStreamName').val(value);
}

//update Stream  entry
$("#updateStream").click(function() {
    var streamName = $("input#editStreamName").val();
    var streamId = $("input#editStreamId").val();
    if (streamName.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "updateStream",
            data: {
                "streamName": streamName,
                "streamId": streamId
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#streamSuccess").hide();
                    $("ladel#streamError").show();
                    $("input#streamName").val('');
                    $("label#streamError").text("Stream already exists");
                } else if (data == 'success') {
                    $("label#streamError").hide();
                    $("label#streamSuccess").show();
                    $("input#streamName").val('');
                    $("label#streamSuccess").text("Stream updated successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            erroe: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#streamError").text("Please Enter Stream");
    }
});

//edit Task Priority  entry
function editTaskPriority(key, value) {
    $('#editTaskPriorityId').val(key);
    $('#editTaskPriorityName').val(value);
}

//update Task Priority  entry
$("#updateTaskPriority").click(function() {
    var taskPriorityName = $("input#editTaskPriorityName").val();
    var taskPriorityId = $("input#editTaskPriorityId").val();
    if (taskPriorityName.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "updateTaskPriority",
            data: {
                "taskPriorityName": taskPriorityName,
                "taskPriorityId": taskPriorityId
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#taskPrioritySuccess").hide();
                    $("label#taskPriorityError").show();
                    $("input#taskPriorityName").val('');
                    $("label#taskPriorityError").text("Task Priority already exists");
                } else if (data == 'success') {
                    $("label#taskPriorityError").hide();
                    $("label#taskPrioritySuccess").show();
                    $("input#taskPriorityName").val('');
                    $("label#taskPrioritySuccess").text("Task Priority updated successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#taskPriorityError").text("Please Enter Task Priority");
    }
});

//edit Task Type  entry
function editTaskType(key, value) {
    $('#editTaskTypeId').val(key);
    $('#editTaskTypeName').val(value);
}

//update Task Type  entry
$("#updateTaskType").click(function() {
    var taskTypeName = $("input#editTaskTypeName").val();
    var taskTypeId = $("input#editTaskTypeId").val();
    if (taskTypeName.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "updateTaskType",
            data: {
                "taskTypeName": taskTypeName,
                "taskTypeId": taskTypeId
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#taskTypeSuccess").hide();
                    $("label#taskTypeError").show();
                    $("input#taskTypeName").val('');
                    $("label#taskTypeError").text("Task Type already exists");
                } else if (data == 'success') {
                    $("label#taskTypeError").hide();
                    $("label#taskTypeSuccess").show();
                    $("input#taskTypeName").val('');
                    $("label#taskTypeSuccess").text("Task Type updated successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#taskTypeError").text("Please Enter Task Type");
    }
});

//edit Leave Type  entry
function editLeaveType(key, value) {
    $('#editLeaveTypeId').val(key);
    $('#editLeaveTypeName').val(value);
}

//update Leave Type  entry
$("#updateLeaveType").click(function() {
    var leaveTypeName = $("input#editLeaveTypeName").val();
    var leaveTypeId = $("input#editLeaveTypeId").val();
    if (leaveTypeName.length != 0 && leaveTypeId.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "updateLeaveType",
            data: {
                "leaveTypeName": leaveTypeName,
                "leaveTypeId": leaveTypeId,
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#leaveTypeSuccess").hide();
                    $("label#leaveTypeError").show();
                    $("input#leaveTypeName").val('');
                    $("label#leaveTypeError").text("Leave Type already exists");
                } else if (data == 'success') {
                    $("label#leaveTypeError").hide();
                    $("label#leaveTypeSuccess").show();
                    $("input#leaveTypeName").val('');
                    $("label#leaveTypeSuccess").text("Leave Type updated successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#leaveTypeError").text("Please Enter Leave Type");
    }
});

//edit Event Type  entry
function editEventType(key, value) {
    $('#editEventTypeId').val(key);
    $('#editEventTypeName').val(value);
}

//update Event Type  entry
$("#updateEventType").click(function() {
    var eventTypeName = $("input#editEventTypeName").val();
    var eventTypeId = $("input#editEventTypeId").val();
    if (eventTypeName.length != 0 && eventTypeId.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "updateEventType",
            data: {
                "eventTypeName": eventTypeName,
                "eventTypeId": eventTypeId,
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#eventTypeSuccess").hide();
                    $("label#eventTypeError").show();
                    $("input#eventTypeName").val('');
                    $("label#eventTypeError").text("Event Type already exists");
                } else if (data == 'success') {
                    $("label#eventTypeError").hide();
                    $("label#eventTypeSuccess").show();
                    $("input#eventTypeName").val('');
                    $("label#eventTypeSuccess").text("Event Type updated successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#eventTypeError").text("Please Enter Event Type");
    }
});

//edit Project Status  entry
function editProjectStatus(key, value) {
    $('#editProjectStatusId').val(key);
    $('#editProjectStatusName').val(value);
}

//update Project Status  entry
$("#updateProjectStatus").click(function() {
    var projectStatusName = $("input#editProjectStatusName").val();
    var projectStatusId = $("input#editProjectStatusId").val();
    if (projectStatusName.length != 0 && projectStatusId.length != 0) {
        $.ajax({
            type: "POST",
            url: org_path + "updateProjectStatus",
            data: {
                "projectStatusName": projectStatusName,
                "projectStatusId": projectStatusId,
            },
            success: function(data) {
                console.log(data);
                if (data == 'failure') {
                    $("label#projectStatusSuccess").hide();
                    $("label#projectStatusError").show();
                    $("input#projectStatusName").val('');
                    $("label#projectStatusError").text("Project status already exists");
                } else if (data == 'success') {
                    $("label#projectStatusError").hide();
                    $("label#projectStatusSuccess").show();
                    $("input#projectStatusName").val('');
                    $("label#projectStatusSuccess").text("Project status updated successfully");
                    window.setTimeout('location.reload()', 0);
                }
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    } else {
        $("label#taskStatusError").text("Please Enter Project Status");
    }
});


function viewNotification(notificationId) {
    $.ajax({
        type: "GET",
        url: org_path + "getNotificationDetails",
        data: {
            "notificationId": notificationId
        },
        success: function(data) {
            $("p#name").text(data.name);
            $("textarea#description").text(data.description);
            $("p#type").text(data.type);
            $("p#createdDate").text(data.createdDate);
        },
        error: function(result) {
            alert("An error occured: " + result.status + " " + result.statusText);
        }
    });
    
    function bindMonthYear () {
    	var year = $('#payslip_year option:selected').val()
    	var month = $('#payslip_month option:selected').val()	
    	$('#selected_year').val(year);
    	$('#selected_month').val(month);
    }
}

function handleDateForamtForLeave() {
    var dateFormat = $("input#dateFormat").val();
    var newFormat = dateFormat.toUpperCase();
    var leaveMinDate = new Date();
    var leaveMaxDate = new Date();
    leaveMinDate.setDate(leaveMinDate.getDate() - 1);
    leaveMaxDate.setDate(leaveMaxDate.getDate() + 90);
   
    $('#leave_datepicker1').datetimepicker({
        format: newFormat,
        minDate: leaveMinDate,
        maxDate: leaveMaxDate,
        ignoreReadonly:true
    });

    $('#leave_datepicker2').datetimepicker({
        format: newFormat,
        minDate: leaveMinDate,
        maxDate: leaveMaxDate,
        ignoreReadonly:true
    });
	
	$('#leave_report_datepicker1').datetimepicker({
        format: newFormat,
        ignoreReadonly:true
    });

    $('#leave_report_datepicker2').datetimepicker({
        format: newFormat,
        ignoreReadonly:true
    });

    $("#leave_report_datepicker1").on("dp.change", function(e) {
        $('#leave_report_datepicker2').data("DateTimePicker").minDate(e.date);
    });

    $("#leave_datepicker2").on("dp.change", function(e) {
        $('#leave_report_datepicker1').data("DateTimePicker").maxDate(e.date);
    });

    $('#leave_startDate').datetimepicker({
        format: newFormat
    });

    $('#leave_endDate').datetimepicker({
        format: newFormat
    });
	
    $("#leave_datepicker1").on("dp.change", function(e) {
        $('#leave_datepicker2').data("DateTimePicker").minDate(e.date);
    });

    $("#leave_datepicker2").on("dp.change", function(e) {
        $('#leave_datepicker1').data("DateTimePicker").maxDate(e.date);
    });
    
    
}
//date picker validations for notifications
function handleNotificationDateForamt() {
    var dateFormat = $("input#dateFormat").val();
    var newFormat = dateFormat.toUpperCase();
    
    $('#notificationdatepicker1').datetimepicker({
        format: newFormat,
        minDate: 'now',
        ignoreReadonly:true
    });

    $('#notificationdatepicker2').datetimepicker({
        format: newFormat,
        minDate: 'now',
        ignoreReadonly:true
    });
    
    $('#notificationdatepicker4').datetimepicker({
        format: newFormat,
        ignoreReadonly:true
    });

    $('#notificationdatepicker5').datetimepicker({
        format: newFormat,
        ignoreReadonly:true
    });

    $("#notificationdatepicker1").on("dp.change", function(e) {
    	$('#notifications').formValidation('revalidateField', 'fromDate');
        $('#notificationdatepicker2').data("DateTimePicker").minDate(e.date);
    });
    
    $("#notificationdatepicker2").on("dp.change", function(e) {
    	$('#notifications').formValidation('revalidateField', 'toDate');
        $('#notificationdatepicker1').data("DateTimePicker").maxDate(e.date);
    });

    $("#notificationdatepicker4").on("dp.change", function(e) {
        $('#notificationdatepicker5').data("DateTimePicker").minDate(e.date);
    });
    
    $("#notificationdatepicker5").on("dp.change", function(e) {
        $('#notificationdatepicker4').data("DateTimePicker").maxDate(e.date);
    });
    
}

function validateHrEmail() {
	var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	var hr_email =  $("#hr_email").val();
	if (regex.test(hr_email)) {
		 $("span#errorMessage").text("");
	} else {
		 $("span#errorMessage").text("Invalid email format.");
	}
}

function saveAdvancedTimeSheet() {
	
    var employeebox2View = $('#employeebox2View')[0].options;
    var employeeArray = $.map(employeebox2View, function(elem) {
    	return (elem.value);
    });
    
    var jsonObj = {};
    jsonObj.empIds = employeeArray;
    
    $("#empIds").val(JSON.stringify(jsonObj));
}

    