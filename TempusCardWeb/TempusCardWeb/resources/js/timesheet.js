var dateFormat = $("input#dateFormat").val();
var newFormat = dateFormat.toUpperCase();

$("#datepicker1").on("dp.change", function(e) {
	 $('#addManualEntry').formValidation('revalidateField', 'date');
});
$('#hoursSpent').timepicker({showMeridian: false, defaultTime: "00:00"}).on('changeTime.timepicker', function(e) {
	 $('#addManualEntry').formValidation('revalidateField', 'hoursSpent');
});

//add timesheet entry field validations
$('#addManualEntry').formValidation({
		message: '',
		feedbackIcons: {
           validating: 'glyphicon glyphicon-refresh'
		},
		fields: {
			name: {
				validators: {
					notEmpty: {
						message: 'The task name is required.'
					},
				}
			},
			projectId: {
				validators: {
					notEmpty: {
						message: 'Please select project.'
					}
				}
			},
			description: {
				validators: {
					notEmpty: {
						message: 'The task description is required.'
					}
				}
			},
			priorityId: {
				validators: {
					notEmpty: {
						message: 'The task priority is required.'
					}
				}
			},
			statusId: {
				validators: {
					notEmpty: {
						message: 'The task status is required.'
					}
				}
			},
			typeId: {
				validators: {
					notEmpty: {
						message: 'The task type is required.'
					}
				}
			},
			date: {
                validators: {
                	notEmpty: {
						message: 'The date is required.'
					},
                    date: {
                        format: newFormat,
                        message: 'The date should be '+ newFormat  
                    }
                }
            },
			hoursSpent: {
				validators: {
					notEmpty: {
						message: 'The hours spent is required.'
					},
                    callback:{
                    	message: 'The Hours spent should not be 0:00',
                    	callback: function(value, validator) {
                    		var hs = $("input#hoursSpent").val();
                    	if(!(hs == '0:00' || hs == '00:00')){
                    	        var result = validateTaskTime();
                    	        var date1 = new Date();
                    	        date1.setHours($("input#hoursSpent").val().split(":")[0]);
                    	        date1.setMinutes($("input#hoursSpent").val().split(":")[1]);
                    	        var date2 = new Date();
                    	        date2.setHours($("input#defaultMaxHoursPerTask").val().split(":")[0]);
                    	        date2.setMinutes($("input#defaultMaxHoursPerTask").val().split(":")[1]);
                    	        var date3 = new Date();
                    	        date3.setHours($("input#defaultMaxHoursPerDay").val().split(":")[0]);
                    	        date3.setMinutes($("input#defaultMaxHoursPerDay").val().split(":")[1]);
                    	        var date4 = new Date();
                    	        date4.setHours(result[1].split(":")[0]);
                    	        date4.setMinutes(result[1].split(":")[1]);
                    	        if (result[0]) {
                    	        	
                    	        	//day and task restrict
                    	          if($("input#maxHoursRestrict").val() != 'Y' && $("input#maxHoursWarn").val() == 'Y'  &&  date1.getTime() > date2.getTime()) {
                    	        	  $("#info_msg").html("The Hours spent should be less than " + $("input#defaultMaxHoursPerTask").val() + " per Task");
                    	        	  $("#error_msg").html("");
                    	          }else if ($("input#maxHoursRestrict").val() != 'Y' && $("input#maxHoursWarn").val() != 'Y'  && $("input#dayMaxHoursRestrict").val() == 'Y' &&  date1.getTime() >= date3.getTime()){
                    	        	   $("#error_msg").html("The Hours spent should be less than " + $("input#defaultMaxHoursPerDay").val() + " per Day");
                    	        	   $("#info_msg").html("");
                    	           } else if ($("input#maxHoursRestrict").val() != 'Y' && $("input#maxHoursWarn").val() != 'Y' && $("input#dayMaxHoursRestrict").val() != 'Y' && $("input#dayMaxHoursWarn").val() == 'Y' &&  date1.getTime() >= date3.getTime()){
                    	        	   $("#info_msg").html("The Hours spent should be less than " + $("input#defaultMaxHoursPerDay").val() + " per Day");
                    	           } else{
                    	        	   $("#info_msg").html("");
                    	        	   $("#error_msg").html("");
                    	           }
                    	            return true;
                    	      	
                    	        } else  {
                  	            $(".help-block").html("");
                    	            if(date4.getTime() >= date2.getTime() && $("input#maxHoursRestrict").val() == 'Y') {
                    	              $("#error_msg").html("The Hours spent should be less than " + $("input#defaultMaxHoursPerTask").val() + " per Task");
                    	              $("#info_msg").html("");
                    	            } else {
                    	            $("#error_msg").html("The Hours spent should be less than " + $("input#defaultMaxHoursPerDay").val() + " per Day");
                    	            $("#info_msg").html("");
                    	             }
                    	          return false;
                    	      	 }
                    	}else {
                    			 
                    			 $("#error_msg").html("");
                    			 $("#info_msg").html("");
                    		   
                    			 return false;
                    		}   		
                            
                           
                    	}
                    }
				}
			}
			
		}
	});


//validate by the timeSheet restrictions
function validateTaskTime() {
	    var hoursSpent = $("input#hoursSpent").val();
	    var maxHoursPerTask = $("input#maxHours").val();
	    var createdDate = $("input#date").val();
	    var now = moment().format("DD/MM/YYYY");
	    var ms = moment(now, "DD/MM/YYYY").diff(moment(createdDate, "DD/MM/YYYY"));
	    var taskId = $("input#id").val();
	    var resultValue = [false, ""];
	    var date1 = new Date();
	    date1.setHours(hoursSpent.split(":")[0]);
        date1.setMinutes(hoursSpent.split(":")[1]);
        if (ms > 0) {
	        $.ajax({
	            type: "GET",
	            url: org_path + "getAvailbleTime",
	            dataType: "html",
	            async: false,
	            data: {
	                "createdDate": createdDate,
	                "taskId" : taskId
	            },
	            success: function(data) {
	            	var date3 = new Date();
	            	date3.setHours(data.split(":")[0]);
	                date3.setMinutes(data.split(":")[1]);
	                if (date1.getTime() > date3.getTime()) {
	                	resultValue = [false,data];
	    	        } else {
	    	        	resultValue = [true,data];
	    	        }
	               
	            },
	            error: function(result) {
	                alert("An error occured: " + result.status + " " + result.statusText);
	            }
	        });
	    } else {
	    	var date2 = new Date();
	        date2.setHours(maxHoursPerTask.split(":")[0]);
	        date2.setMinutes(maxHoursPerTask.split(":")[1]);
	        if (date1.getTime() > date2.getTime()) {
	        	resultValue = [false,maxHoursPerTask];
	        } else {
	        	resultValue = [true,maxHoursPerTask];
	        }
	    }
       return resultValue;
       
       
     } 
function validateTimeSettings()
{
	 var date1 = new Date();
     date1.setHours($("input#dayMaxHours").val().split(":")[0]);
     date1.setMinutes($("input#dayMaxHours").val().split(":")[1]);
     var date2 = new Date();
     date2.setHours($("input#taskMaxHours").val().split(":")[0]);
     date2.setMinutes($("input#taskMaxHours").val().split(":")[1]);
    if(date2.getTime() >= date1.getTime() ) {
      $("#error_msg1").html("The Max Hours Per Task should be less than  Max Hours per Day");
      $('.hoursTask').addClass('has-error');
      $('.hoursTask').removeClass('has-success');
      $('#settingSave').prop('disabled', true);
    } else {
       $("#error_msg1").html("");
       $('.hoursTask').removeClass('has-error');
       $('.hoursTask').addClass('has-success');
       $('#settingSave').prop('disabled', false);
      
   }	
    return true;
}
function handleDateForamtForTimesheet() {
    var dateFormat = $("input#dateFormat").val();
    var newFormat = dateFormat.toUpperCase();
    if ($("input#dueDays").val() != '' && $("input#dueDays").val() != '0') {
        var minTsDate = new Date();
        minTsDate.setDate(minTsDate.getDate() - $("input#dueDays").val());
       $('#datepicker1').datetimepicker({
            format: newFormat,
            maxDate: 'now',
            minDate: minTsDate,
            ignoreReadonly: true
        });
       } else {
        $('#datepicker1').datetimepicker({
            format: newFormat,
            maxDate: 'now',
            ignoreReadonly: true
        });
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
}

$(".reset").click(function() {
	 var date = $.fullCalendar.formatDate(new Date(), $("input#dateFormat").val());
	$(this).closest('form').formValidation('resetForm', true);
    $('#chooseEmployeeId').trigger("chosen:updated");
    $('#date').val(date);
});
