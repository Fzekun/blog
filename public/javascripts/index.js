/**
 * Created by fengzekun on 16/11/24.
 */
$(function(){
    var $loginBox = $('#login'),
        $register = $('#register'),
        $admin = $('#admin'),
        $loginOut = $('#loginOut');


    $loginBox.find('.showRegister').on('click',function(){
        $register.removeClass('hide');
        $loginBox.addClass('hide');
    });
    $register.find('.showLogin').on('click',function(){
        $loginBox.removeClass('hide');
        $register.addClass('hide');
    });
    //注册
    $register.find('#btn-register').on('click',function(){

        $.ajax({
            type : "post",
            url  : '/api/register',
            data : {
                username : $register.find('[name=username]').val(),
                password : $register.find('[name=password]').val(),
                repassword : $register.find('[name=repassword]').val()
            },
            dataType : 'json',
            success : function(data){

                if(!data.code){
                    setTimeout(function(){
                        $register.addClass('hide');
                        $loginBox.removeClass('hide');
                    },1000);
                }
                $register.find('#result').html(data.message);
            }
        })
    })
    $loginBox.find('#btn-login').on('click',function(){
       $.ajax({
           type : 'post',
           url : '/api/login',
           data:{
               username : $loginBox.find('[name=username]').val(),
               password : $loginBox.find('[name=password]').val()
           },
           dataType : 'json',
           success : function(data){
                if(!data.code){
                    setTimeout(function(){
                        location.href = location.href;
                    },1000);

                }
               $loginBox.find('#login_result').html(data.message);
           }
       })
    });
    $loginOut.on('click',function(){
        $.ajax({
            url : '/api/loginout',
            success : function(data){
                if(!data.code){
                    location.href = location.href;
                }
            }
        })
    });
})