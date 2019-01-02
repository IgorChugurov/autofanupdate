angular
    .module('myApp.services')
    .factory('exception', exception);

exception.$inject = ['toaster'];

function exception(toaster) {
    var service = {
        catcher: catcher,
        showToaster:showToaster
    };
    return service;

    function catcher(header,err) {
      if(err){
        if(typeof err=='object'){
          if(err.data){
            err=err.data
          }
          if(err.message){
            err=err.message
          }else if(err.error){
            err=err.error
          }
        }
      }else{
          err='ошибка'
      }
      console.log(header,err);
      try{
        toaster.pop('error',header,err);
      }catch(err){
          console.log(err)
      }


    }
    function showToaster(type,title,content){
        if(typeof content=='object'){
            if(content.message){
                content=content.message
            }else if(content['error']){
                content=content['error']
            }
        }
        toaster.pop({
            type: type,
            title: title,
            body: content,
            bodyOutputType: 'trustedHtml',
            showCloseButton: true,
            delay:15000,
            closeHtml: '<button>Close</button>'
        });
    }
}
