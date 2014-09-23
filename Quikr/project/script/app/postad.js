(function(global){
    var PostAdModel,
        app = global.app = global.app || {};
    
    PostAdModel = kendo.data.ObservableObject.extend({
        
        adtitle:'',
        addescript:'',
        state:0,
        city:0,
        address:'',
        email:'',
        mobileNumber:'',
        category:0,
        subcategory:0,
        hideVal:'',
        
        show:function(){
           
            
            $(".km-scroll-container").css("-webkit-transform", "");
            var state_dataSource = new kendo.data.DataSource({
                transport:{
                    read:{
                        url:'project/data/state.json',
                        dataType:'json'
                    }
                }
            });
            
             var category_dataSource = new kendo.data.DataSource({
                transport:{
                    read:{
                        url:'project/data/category.json',
                        dataType:'json'
                    }
                }
            });
            
             var subcategory_dataSource = new kendo.data.DataSource({
                transport:{
                    read:{
                        url:'project/data/subcategory.json',
                        dataType:'json'
                    }
                }
            });
            
            $("#state").kendoDropDownList({	//for city dropdownlist
                optionLabel: "Select State",
                dataTextField: "stateName",
                dataValueField: "stateId",
                dataSource:state_dataSource,
                index:0,
                select:function(e){
                    // var index = e.item.index();
                    app.postService.viewModel.localityListView(e);
                   // $("#address").val("");
                    //$("#state").closest(".k-widget").hide();
                }
            });
            
            $("#category").kendoDropDownList({	//for category dropdownlist
                optionLabel: "Select Category",
                dataTextField: "name",
                dataValueField: "id",
                dataSource:category_dataSource,
                index:0,
                select:function(e){
                }
            });
            
            $("#subcategory").kendoDropDownList({	//for subcategory dropdownlist
                optionLabel: "Select Sub Category",
                cascadeFrom: "category",
                cascadeFromField: "parentId",
                dataTextField: "name",
                dataValueField: "id",
                dataSource:subcategory_dataSource,
                index:0,
                select:function(e){
                    var itemText = e.item.text();
                    app.postService.viewModel.createHtml(itemText);
                }
            });
            
             $.validator.addMethod("adTitle",
                function(value, element, params) {
                    var typedWords = jQuery.trim(value).split(' ').length;
                    if(typedWords  >= 4) {
                    return true;
                    }
                }
            );
            
            $.validator.addMethod("descriptionLength",
                function(value, element, params) {
                    var typedWords = jQuery.trim(value).split(' ').length;
                    if(typedWords  >= 8) {
                    return true;
                    }
                }
            );
            
             $.validator.addMethod("email_regexp",
                function(value, element) {
                    return this.optional(element) || /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
                }
            );
            
            $.validator.addMethod("lettersonly", 
            	function(value, element) {
             		 return this.optional(element) || /^[a-z]+$/i.test(value);
            	}
            ); 
            
            $("#postAdfrm").validate({	//validation for postad 1st form
                rules:{
                        adtitle:{
                        required:true,
                        adTitle: true
                        },
                        AdDescription:{
                        required:true,
                        descriptionLength:true
                        },
                        city:{
                        index:true
                        },
                        address:{
                        required:true
                        }
                   },
                messages:{
                        adtitle:{
                        required:"Please Enter Ad Title.",
                        adTitle:"Please enter Ad title atleast 4 words."
                        },
                        AdDescription:{
                        required:"Please Enter Ad Description.",
                        descriptionLength:"Please enter Ad Description atleast 8 words."
                        },
                        address:{
                        required:"Plesase Enter Address details."
                        }
                   },
                submitHandler:function(form){
                            return false;
                }
            });
            
            
            $("#postAdfrm2").validate({
                rules:{
                    name:{
                      required:true,
                      lettersonly:true
                    },
                    email:{
                        required:true,
                        email_regexp:true
                    },
                    mobile:{
                        required:true,
                        number:true,
                        minlength:10
                    }
                },
                messages:{
                    name:{
                        required:"Please enter your name.",
                        lettersonly:"Alphabetic character only Please."
                    },
                    email:{
                        required:"Please Enter Email Address.",
                        email_regexp:"Please Enter valid Email Address."
                    },
                    mobile:{
                        required:"Please Enter Mobile number.",
                        number:"Please Enter 10 digit mobile number.",
                        minlength:"Please enter at least 10 number."
                    }
                    
                },
                submitHandler:function(form){
                    return false;
                }
            });

        },
        
        localityListView:function(e){			 //Locality list view Function
            
            $("#address").css("display","none");
            if(e.item.index() === 0 || e.item.index() === '0')
            {
                $("#cityId").closest(".k-widget").css("display","none");
                 $("#address").css("display","none");
            }
            else
            {
                    $("#cityId").kendoDropDownList({
                        optionLabel: "Choose City",
                        cascadeFrom: "state",
                        cascadeFromField: "stateId",
                        dataTextField: "CityName",
                        dataValueField: "cityId",
                        dataSource:{
                            transport:{
                                read:{
                                    url:'project/data/city.json',
                                    dataType:'json'
                                }
                            }
                        },
                        select:function(){
                            $("#address").show();
                        }
                   });
            }
            
        },
        
        dropDownvalidationFirstFormField:function(){			//dropdownlist validation function
            
             var dropdownlist1 = $("#state").data("kendoDropDownList");
             var dropdownlist2 = $("#cityId").data("kendoDropDownList");
          
            if(dropdownlist1.select() === 0)
            {
               navigator.notification.alert("Please select State",function(){},"Notification","OK");
                return false;
            }
            
            if(dropdownlist2.select() === 0)
            {
                navigator.notification.alert("Please Select City",function(){},"Notification","OK");
                return false;
            }
            else
            { 
                app.postService.viewModel.postadFirstFormData();
            }
        },
        
        dropDownvalidationSecondFormField:function(){			//dropdownlist validation function
            
             var dropdownlist1 = $("#category").data("kendoDropDownList");
             var dropdownlist2 = $("#subcategory").data("kendoDropDownList");
          
            if(dropdownlist1.select() === 0)
            {
               navigator.notification.alert("Please select Category",function(){},"Notification","OK");
                return false;
            }
            
            if(dropdownlist2.select() === 0)
            {
                navigator.notification.alert("Please Select Sub category",function(){},"Notification","OK");
                return false;
            }
            else
            { 
                app.postService.viewModel.postadSecondFormData();
            }
        },
        
        createHtml:function(item){
            $("#sellText").html(item);
            $("#buyText").html(item);
        },
        
        postadFirstFormData:function(){
            
            var dataParam={};
            var that = this;
         
            dataParam['adtitle'] = that.get("adtitle").trim();
            dataParam['addescript'] =that.get("addescript").trim();
            dataParam['state'] =that.get("state");
            dataParam['city'] =that.get("city");
            dataParam['address'] =that.get("address").trim();
            dataParam['imageSrc'] = $("#smallImage").attr('src');
            
            console.log(dataParam);
            apps.navigate("#postAd2");
        },
        
        postadSecondFormData:function(){  
            
            var status = $("#postAdfrm2").valid();
            if(status === false)
            {
                return false;
            }
            else
            {
                 var dataParam={};
                var that = this;
                dataParam['name']=that.get("name");
                dataParam['category'] =that.get("category");
                dataParam['subcategory'] =that.get("subcategory");
                dataParam['email'] =that.get("email").trim();
                dataParam['mobile'] =that.get("mobileNumber");
                console.log(dataParam);
                //apps.navigate("#postad2");
            }
        }, 
        
        backBTN:function(){
            navigator.notification.confirm("Would you like to cancel posting?",function(confirm){
                if(confirm === 1 || confirm === '1')
                {
                    app.postService.viewModel.resetAllFields();
                    apps.navigate("#home");
                }
            },"Notification","Yes,No");  
        },
        
        setValue:function(val){
            this.set("hideVal",val);
        },
        
        deleteImage:function(e){
          //console.log(e);
            var that = this;
            var ind;
            var index = that.get("hideVal");
            var divId = e.currentTarget.parentElement.parentElement.id;
            var imgId = e.currentTarget.lastChild.id;
            
            console.log("image hidden value "+index);
            console.log("Image Div Id "+divId);
            console.log("image id "+imgId);
           
            //alert("DivId "+divId+" "+"imgId "+imgId);
            
             navigator.notification.confirm('Do you really want to delete Image?',function(confirmed){
                if(confirmed === true || confirmed ===1)
                {
                    if(index>0)
                    {
                        $("#"+divId).css("display","none");
                        $("#"+imgId).css("display","none");
                        ind = --index;
                        console.log("decrment index "+index);
                        that.set("hideVal",ind);
                    }
                    else
                    {
                        window.cameraApp.run();
                    }
                    
                }
            },'Exit','Yes,No');
            
           
            
            
           /* if(index>0)
            {
                alert(index);
                $("#"+divId).remove();
                divId.style.display = 'none';
                imgId.style.display = 'none';
                ind = --index;
                alert("After decrement "+ind)
                that.set("hideVal",ind);   
            }
            else
            {
               alert("run");
                window.cameraApp.run();
            }*/
        },
        
        resetAllFields:function(){
            var that = this;
            that.set("adtitle","");
            that.set("addescript","");
            that.set("state",0);
            that.set("city",0);
            that.set("address","");
            that.set("email","");
            that.set("mobileNumber","");
            that.set("category","");
            that.set("subcategory","");
            that.set("name","");
            $('input.error').css({"background-color":"white","border":"1px solid #B2B2B2"});
            $('label.error').css("display","none");
            $('textarea.error').css({"background-color":"white","border":"1px solid #B2B2B2"});
            $("#cityId").closest(".k-widget").css("display","none");
            $("#address").css("display","none");
            $('.km-content:visible').data('kendoMobileScroller').reset();
            $('#picture1').css('display','none');
            $('#picture2').css('display','none');
        },
        
        postadSubmitFirst:function(){
           var status= $("#postAdfrm").valid();
            if(status === false)
            {
                return false;
            }
            else
            {
               app.postService.viewModel.dropDownvalidationFirstFormField();
            }
            
            // apps.navigate("#postAd2");
           
        }
    });
    
    app.postService ={
      viewModel : new PostAdModel()  
    };
})(window);