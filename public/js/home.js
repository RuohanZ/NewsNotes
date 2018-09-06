
$("#scrape-btn").on("click", function(){
   $.get("/scrape").then(function(data){
       
       if(data){
         window.location.href="/" 
       }else{
         alert("Already up-to-date!")
       }
   })
});

$("#clear-btn").on("click",function(){
    $.get("/clear").then(function(data){
       if(data){
        window.location.href="/"   
       }
    })
});

$(".save-btn").on("click",function(){
    console.log($(this).attr("data-id"))
    var id = $(this).attr("data-id");
    $.ajax("/api/saved/"+id,{
        type:"PUT"
    }).then(function(data){
        if(data){
        window.location.href="/"   
        }
    })
});

$(".delete-btn").on("click",function(){
    console.log($(this).attr("data-id"))
    var id = $(this).attr("data-id");
    $.ajax("/api/delete/"+id,{
        type:"PUT"
    }).then(function(data){
        if(data){
        window.location.href="/saved"   
        }
    })
});

$(".add-btn").on("click",function(){
    var articleId = $(this).attr("data-id");
    var newNote = {
        body:$(".newNote").val()
    }
    $.ajax("/api/addNote/"+articleId,{
        type:"PUT",
        data:newNote
    }).then(function(data){
        if(data){
        window.location.href="/saved"   
        }
    })

})