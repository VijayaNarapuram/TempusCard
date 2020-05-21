var app_path = $("input#app_path").val();
var org_path = app_path + "/";
var TIME_PATTERN = /^(09|1[0-7]{1}):[0-5]{1}[0-9]{1}$/;
var EXCEL_SUPPORTED_FORMATS = 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
var EXCEL_EXTENSIONS = 'xls, xlsx';

$(document).ready(function() {
	
	
    $('#generalSettings').formValidation({
        message: '',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            url: {
                validators: {
                    notEmpty: {
                        message: 'The organisation url  is required.'
                    },
                }
            },
            name: {
                validators: {
                    notEmpty: {
                        message: 'The organisation name is required.'
                    },
                }
            },
            address: {
                validators: {
                    notEmpty: {
                        message: 'The organisation address is required.'
                    },
                }
            }
        }
    });

    // add notification validations
    $('#notifications').formValidation({
        message: '',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
           
        	fromDate: {
                validators: {
                    notEmpty: {
                        message: 'The notification from date is required.'
                    }
                }
            },
            toDate: {
                validators: {
                    notEmpty: {
                        message: 'The notification to date is required.'
                    },
                }
            },
        	type: {
                validators: {
                    notEmpty: {
                        message: 'The notification type is required.'
                    },
                }
            },
            name: {
                validators: {
                    notEmpty: {
                        message: 'The notification name is required.'
                    },
                }
            },
            description: {
                validators: {
                    notEmpty: {
                        message: 'The notification description is required.'
                    },
                }
            },
            visibleToProject: {
                validators: {
                    notEmpty: {
                        message: 'The visible to project is required.'
                    },
                }
            },
            visibleToOrg: {
                validators: {
                    notEmpty: {
                        message: 'The visible to organization is required.'
                    },
                }
            }
        }
    });
    
	 
    //add client validations
    $('#clientValidation').formValidation({
        message: 'This value is not valid',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: 'The organisation name is required.'
                    },
                }
            },
            address: {
                validators: {
                    notEmpty: {
                        message: 'The office address is required.'
                    },
                }
            },
            tcName: {
                validators: {
                    notEmpty: {
                        message: 'The full name is required.'
                    },
                }
            },
            tcEmail: {
                validators: {
                    notEmpty: {
                        message: 'The  email is required.'
                    },
                    emailAddress: {
                        message: 'The email address you entered is not a valid address.'
                    }
                }
            },
            tcPrimaryPhone: {
                validators: {
                    notEmpty: {
                        message: 'The primary phone number is required.'
                    },
                    digits: {
                        message: 'The primary phone number accepts digits only.'
                    }
                }
            },
            bcName: {
                validators: {
                    notEmpty: {
                        message: 'The full name is required.'
                    },
                }
            },
            bcEmail: {
                validators: {
                    notEmpty: {
                        message: 'The  email is required.'
                    },
                    emailAddress: {
                        message: 'The email address you entered is not a valid address.'
                    }
                }
            },
            bcPrimaryPhone: {
                validators: {
                    notEmpty: {
                        message: 'The primary phone number is required.'
                    },
                    digits: {
                        message: 'The primary phone number accepts digits only.'
                    }
                }
            },
            tcSecondaryPhone :{
            	validators:{
	            	digits: {
	                    message: 'The secondary phone number accepts digits only.'
	                		}
            	}
            },
            bcSecondaryPhone: {
            	validators:  {
            		digits: {
            			message : 'The secondary phone number accepts digits only.'
            		}
            	}
            }
        }
    });

    $('#newItemTodo').formValidation({
        message: 'This value is not valid',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            tsTask1: {
                validators: {
                    notEmpty: {
                        message: 'The task name is required.'
                    },
                }
            },
            tsSelectProject1: {
                validators: {
                    notEmpty: {
                        message: 'Please select Project.'
                    },
                }
            }
        }
    });

    //Change Password Validations
    $('#changePassword').formValidation({
        feedbackIcons: {},
        fields: {
        	OldPassword: {
                validators: {
                    notEmpty: {
                        message: 'The old password is required.'
                    }
                }
            },
            newPassword: {
                validators: {
                    notEmpty: {
                        message: 'The new password is required.'
                    },
                    different: {
                        field: 'OldPassword',
                        message: 'The new password can\'t be the same as current password'
                    },
                    stringLength: {
                        min: 6,
                        message: 'The new password  minium 6 characters'
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
                        message: 'The new password and confirm password are not the same'
                    },
                    stringLength: {
                        min: 6,
                        message: 'The confirm password  minium 6 characters'
                    }
                }
            }
        }
    });
  
     //Add Employee Validations
    $('#addEmployee').formValidation({
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
            	
        },
        fields: {
            firstName: {
                validators: {
                    notEmpty: {
                        message: 'The first name is required.'
                    }
                }
            },
            lastName: {
                validators: {
                    notEmpty: {
                        message: 'The last name is required.'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'The password is required.'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email is required.'
                    },
                    emailAddress: {
                        message: 'The email address you entered is not a valid address'
                    }, 
                    callback:{
                    	callback: function(value, validator) {
                    		var email = $("input#email").val();
                    		var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                        	if(email != '' && regex.test(email) == true) {
                        		var status = false;
                        		
                        		$.ajax({
                                    type: "POST",
                                    url: org_path + "checkEmailOccurences",
                                    async: false,
                                    data: {
                                        "email": email
                                    },
                                    success: function(data) {
                                        if (data == true) {
                                            $('#emailmsg').text("You have more than five same email occurences in Tempus Card.");
                                            $('#emailmsg').show();
                                            console.log(false, "You have more than five same email occurences in Tempus Card.");
                                            status = false;
                                        } else {
                                            $('#emailmsg').hide();
                                            $.ajax({
                                    			type: "POST",
                                    			url: org_path + "checkEmail",
                                    			async: false,
                                    			data: {
                                    				"email": email
                                    			},
                                    			success: function(data) {
                                    				if (data == true) {
                                    					$('#emailmsg').text("Email already taken.");
                                                        $('#emailmsg').show();
                                    					console.log(false, "Email already taken");
                                    					status = false;
                                    				} else {
                                    					$('#emailmsg').hide();
                                    					console.log(true, "New Email");
                                    					status = true;
                                    				}
                                    			},
                                    			error: function(result) {
                                    				alert("An error occured: " + result.status + " " + result.statusText);
                                    			}
                                    		});
                                        }
                                    },
                                    error: function(result) {
                                        alert("An error occured: " + result.status + " " + result.statusText);
                                    }
                                });
                        		return status;
                        	} else {
                        		return false;
                        	}   		
                    	}
                    }
                }
            },
            mobile: {
                validators: {
                    notEmpty: {
                        message: 'The mobile number is required.'
                    },
                    digits: {
                        message: 'The mobile number accepts digits only.'
                    }
                }
            },
            bankName: {
                validators: {
                    notEmpty: {
                        message: 'The bank name is required.'
                    }
                }
            },
            accountNumber: {
                validators: {
                    notEmpty: {
                        message: 'The account number is required.'
                    },
                    digits: {
                        message: 'The account number accepts digits only.'
                    }
                }
            },
            empCode: {
                validators: {
                    notEmpty: {
                        message: 'The employee code is required.'
                    }
                }
            },
            roleId: {
                validators: {
                    notEmpty: {
                        message: 'Please select employee role. If role list is empty manage roles under settings.'
                    }
                }
            },
            designationId: {
                validators: {
                    notEmpty: {
                        message: 'Please select employee designation. If designation list is empty manage designations under settings.'
                    }
                }
            },
            dateOfBirth: {
                validators: {
                    notEmpty: {
                        message: 'The employee date of birth is required.'
                    }
                }
            },dateOfJoining: {
                validators: {
                    notEmpty: {
                        message: 'The employee date of joining is required.'
                    }
                }
            }
        }
    });
    

    //Add Project Validations
    $('#addProject').formValidation({
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: 'The project name is required.'
                    },
                    callback:{
                    	callback: function(value, validator) {
                    		var name = $("input#name").val();
                        	if(name != '') {
                        		var status = false;
                        		 $.ajax({
                        	            type: "POST",
                        	            url: org_path + "checkProjectName",
                        	            async: false,
                        	            data: {
                        	                "name": name
                        	            },
                        	            success: function(data) {
                        	                if (data == true) {
                        	                    $('#projectmsg').text("Project name already taken");
                        	                    $('#projectmsg').show();
                        	                    status = false;
                        	                } else {
                        	                    $('#projectmsg').hide();
                        	                    status = true;
                        	                }
                        	            },
                        	            error: function(result) {
                        	                alert("An error occured: " + result.status + " " + result.statusText);
                        	            }
                        	        });
                                       
                        		return status;
                        	} else {
                        		return false;
                        	}   		
                    	}
                    }
                }
            },
            description: {
                validators: {
                    notEmpty: {
                        message: 'The project description is required.'
                    }
                }
            },
            streamId: {
                validators: {
                    notEmpty: {
                        message: 'The project stream is required.'
                    }
                }
            },
            technologyStack: {
                validators: {
                    notEmpty: {
                        message: 'The technology stack is required.'
                    }
                }
            },
            clientId: {
                validators: {
                    notEmpty: {
                        message: 'The project client is required.'
                    }
                }
            },
            projectManagerId: {
                validators: {
                    notEmpty: {
                        message: 'The project manager is required.'
                    }
                }
            }
        }
    });

    //Profile  Validations
    $('#userProfile').formValidation({
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            firstName: {
                validators: {
                    notEmpty: {
                        message: 'The first name is required.'
                    }
                }
            },
            lastName: {
                validators: {
                    notEmpty: {
                        message: 'The last name is required.'
                    }
                }
            },
            mobile: {
                validators: {
                    notEmpty: {
                        message: 'The mobile phone number is required.'
                    },
                    digits: {
                        message: 'The mobile phone number accepts digits only.'
                    }
                }
            },
            file: {
                validators: {
                    file: {
                        extension: 'jpeg,png,jpg',
                        type: 'image/jpeg,image/png,image/jpg',
                        maxSize: 2097152, //2048 * 1024
                        message: 'The selected file is not valid'
                    }
                }
            }
        }
    });

    //forgot password validations
    $('#forgotPassword').formValidation({
        message: 'This value is not valid',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email address is required.'
                    },
                    emailAddress: {
                        message: 'The email address you have provided is not a valid address.'
                    }
                }
            }
        }
    });

    //reset password validations
    $('#resetPassword').formValidation({
        message: 'This value is not valid',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            newPassword: {
                validators: {
                    notEmpty: {
                        message: 'The new password is required.'
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
                        message: 'The password and its confirm are not the same'
                    }
                }
            }
        }
    });

    //signup validations
    $('#signup').formValidation({
        message: 'This value is not valid',
        feedbackIcons: {},
        fields: {
            ownerName: {
                validators: {
                    notEmpty: {
                        message: 'The name is required.'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'The email address is required.'
                    },
                    emailAddress: {
                        message: 'The email address you have provided is not a valid address.'
                    }
                }
            },
            ownerPhone: {
                validators: {
                    notEmpty: {
                        message: 'The mobile phone number is required.'
                    },
                    digits: {
                        message: 'The mobile phone number accepts digits only.'
                    }
                }
            },
            name: {
                validators: {
                    notEmpty: {
                        message: 'The company name is required.'
                    }
                }
            },
            orgPlan: {
                validators: {
                    notEmpty: {
                        message: 'The subscription plan is required.'
                    }
                }
            },
            country: {
                validators: {
                    notEmpty: {
                        message: 'The country name is required.'
                    }
                }
            },
            size: {
                validators: {

                    notEmpty: {
                        message: 'The employee size is required.'
                    },
                    digits: {
                        message: 'The value can contain only digits'
                    }
                }
            },
            contactEmailPassword: {
                validators: {
                    notEmpty: {
                        message: 'The new password is required.'
                    },
                    stringLength: {
                        min: 6,
                        message: 'The new password  minium 6 characters'
                    }
                }
            },
            url: {
                validators: {
                    notEmpty: {
                        message: 'The company url is required.'
                    }
                }
            },
            companyAddress: {
                validators: {
                    notEmpty: {
                        message: 'The company address is required.'
                    }
                }
            },
            reenterPassword: {
                validators: {
                    notEmpty: {
                        message: 'The confirm password is required.'
                    },
                    identical: {
                        field: 'contactEmailPassword',
                        message: 'The new password and confirm passord are not the same'
                    }
                }
            }
        }
    });

    function set_url(str, keep_spaces) {
        if (str) {
            var cleaned = str.toLowerCase();
            cleaned = cleaned.replace(/&/g, 'and');
            cleaned = cleaned.replace(/[^ \w]/g, '');
            cleaned = cleaned.replace(/_/g, '');
            if (keep_spaces == 0) {
                cleaned = cleaned.replace(/[\W]/g, '');
            }
            return (cleaned);
        }
        return
    };
    
    $('#name').keyup(function() {
        var company_name = $(this).val();
        var URL = set_url(company_name, 1);
        if (URL.match(/\W/g)) {
            var substr = URL.split(' ');
            if (substr[0].trim().length > 4) {
                $('#companyurl').val(substr[0]);
                $('#urlmsg1').hide();
            } else if (substr.length > 1) {
                var temp_str = '';
                for (var i = 0; i < substr.length; i++) {
                    temp_str = temp_str + substr[i];
                    if (temp_str.trim().length > 4) {
                        $('#companyurl').val(temp_str.trim());
                        $('#urlmsg1').hide();
                        break;
                    }
                }
            }
        } else if (URL.trim().length > 3) {
            $('#companyurl').val(URL.trim());
            $('#urlmsg1').hide();
        }
        return
    });

    $("#name").on("blur", function() {
        var suburl = $('#appurl').val();
        var suborg = $('#companyurl').val();
        var url = suburl + suborg;
        //		 var url=suborg;
        validate_url(url);
    });
    
    $("#companyurl").on("blur", function() {
        var suburl = $('#appurl').val();
        var suborg = $('#companyurl').val();
        var url = suburl + suborg;
        //		 var url=suborg;
        validate_url(url);
    });

    $("#contactEmail").on("blur", function() {
        var email = $(this).val();
        check_email(email);
    });
    
    $("#employee_Email").on("blur", function() {
        var email = $(this).val();
        checkEmailOccurences(email);
    });
    
    $("#company_Name").on("blur", function() {
        var name = $("input#company_Name").val();
        check_name(name);
    });

    function validate_url(url) {
        $.ajax({
            type: "POST",
            url: org_path + "checkOrgUrl",
            data: {
                "url": url
            },
            success: function(data) {
                if (data == true) {

                    $('#urlmsg').text("Url already taken");
                    $('#urlmsg').show();
                    $('#validateUrl').removeClass("has-success").addClass("has-error");

                } else {
                    $('#urlmsg').hide();
                }
                console.log(data);
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    }

    function check_email(email) {
        $.ajax({
            type: "POST",
            url: org_path + "checkEmail",
            data: {
                "email": email
            },
            success: function(data) {
                if (data == true) {
                    $('#emailmsg').text("Email already taken");
                    $('#emailmsg').show();
                    $('#validateEmail').removeClass("has-success").addClass("has-error");
                } else {
                    $('#emailmsg').hide();
                }
                console.log('check_email...' + data);
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    }
    
    function checkEmailOccurences(email) {
        $.ajax({
            type: "POST",
            url: org_path + "checkEmailOccurences",
            data: {
                "email": email
            },
            success: function(data) {
                if (data == true) {
                    $('#emailmsg').text("You have more than five same email occurences in Tempus Card.");
                    $('#emailmsg').show();
                    $('#validateEmail').removeClass("has-success").addClass("has-error");
                } else {
                    $('#emailmsg').hide();
                    check_email(email);
                }
                console.log('checkEmailOccurences...' + data);
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    }

    function check_name(name) {
        $.ajax({
            type: "POST",
            url: org_path + "checkOrgName",
            data: {
                "name": name
            },

            success: function(data) {
                if (data == true) {
                    $('#namemsg').text("Name already taken");
                    $('#namemsg').show();
                    $('#validateName').removeClass("has-success").addClass("has-error");
                } else {
                    $('#namemsg').hide();
                }
                console.log(data);
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    }

    $("#projectName").on("blur", function() {
        var name = $(this).val();
        check_projectName(name);
    });

    function check_projectName(name) {
        $.ajax({
            type: "POST",
            url: org_path + "checkProjectName",
            data: {
                "name": name
            },
            success: function(data) {
                if (data == true) {
                    $('#projectmsg').text("Project name already taken");
                    $('#projectmsg').show();
                    $('#validateProject').removeClass("has-success").addClass("has-error");
                } else {
                    $('#projectmsg').hide();
                }
                console.log(data);
            },
            error: function(result) {
                alert("An error occured: " + result.status + " " + result.statusText);
            }
        });
    }

    
    $("#leave_datepicker1").on("dp.change", function(e) {
   	 $('#leaveRequest').formValidation('revalidateField', 'fromDate');
   });
    
    //leaverequest validations
    $('#leaveRequest').formValidation({
        message: '',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            subject: {
                validators: {
                    notEmpty: {
                        message: 'The leave title is required.'
                    },
                }
            },
            message: {
                validators: {
                    notEmpty: {
                        message: 'The leave description is required.'
                    }
                }
            },
            typeId: {
                validators: {
                    notEmpty: {
                        message: 'The leave type is required.'
                    }
                }
            },
            fromDate :{
            	notEmpty: {
                    message: 'The from date is required.'
                }
            }
            

        }
    });
    
    $('#paySlipForm').formValidation({
        message: '',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            paySlipFile: {
                validators: {
                    notEmpty: {
                        message: 'The file is required.'
                    },
                    file: {
                        extension: EXCEL_EXTENSIONS,
                        type: EXCEL_SUPPORTED_FORMATS,
                        message: 'Please choose a excel file'
                    }
                }
            }

        }
    });
    
    $('#empImports').formValidation({
        message: '',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            excelFile: {
                validators: {
                    notEmpty: {
                        message: 'The file is required.'
                    },
                    file: {
                        extension: EXCEL_EXTENSIONS,
                        type: EXCEL_SUPPORTED_FORMATS,
                        message: 'Please choose a excel file'
                    }
                }
            }

        }
    });

    $('#projImports').formValidation({
        message: '',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            excelFile: {
                validators: {
                    notEmpty: {
                        message: 'The file is required.'
                    },
                    file: {
                        extension: EXCEL_EXTENSIONS,
                        type: EXCEL_SUPPORTED_FORMATS,
                        message: 'Please choose a excel file'
                    }
                }
            }
        }
    });
    
    $('#viewPaySlip').formValidation({
        message: '',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	year: {
                validators: {
                    notEmpty: {
                        message: 'The year is required.'
                    }
                }
            },
            month: {
                validators: {
                    notEmpty: {
                        message: 'The month is required.'
                    }
                }
            }
        }
    });
    
    $('#addValendarEntry').formValidation({
        message: '',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	date: {
                validators: {
                    notEmpty: {
                        message: 'The date is required.'
                    }
                }
            },
        	title: {
                validators: {
                    notEmpty: {
                        message: 'The title is required.'
                    }
                }
            },
            description: {
                validators: {
                    notEmpty: {
                        message: 'The description is required.'
                    }
                }
            },
            type: {
                validators: {
                    notEmpty: {
                        message: 'The type is required.'
                    }
                }
            }
        }
    });
   

  //Advanced Timesheet Validations
    $('#advancedTimeSheet').formValidation({
    	message: '',
        feedbackIcons: {
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	taskDueDays: {
                validators: {
                    notEmpty: {
                        message: 'The number of days to allow Timesheet entry is required.'
                    }
                }
            }
        }
    })
});


