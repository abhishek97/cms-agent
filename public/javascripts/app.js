/**
 * Created by abhishek on 13/04/17.
 */
'use strict';
 
function resolve(id) {
    console.log('ID: ',id);
    const confirmed = window.confirm('Are you sure?');
    if(!confirmed)
        return ;

    console.log($);

    $.getJSON('http://localhost:8081/fbApi/resolve/'+id )
        .done(data=>{
            window.location.reload();
    }) .fail(err=>{
        console.log(err);
        window.location.href = "/500";
    })
}