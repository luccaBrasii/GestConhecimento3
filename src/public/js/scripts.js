
$('#post-comment').hide();
$('#btn-toggle-comment').click(e => {
    e.preventDefault();
    $('#post-comment').slideToggle();
  });



$('#btn-like').click(function(e) {
    e.preventDefault();
    let img_id = $(this).data('id');

    $.post('/images/'+ img_id +'/like')
        .done(data => {
            console.log(data);
            $('.likes-count').text(data.likes);
        });
    
});

$('#btn-delete').click(function(e) {
    e.preventDefault();
    let $this = $(this);
    const res =  confirm('Estas seguro?');

    if(res) {
        let imgId = $(this).data('id');
        $.ajax({
            url:'/images/' + imgId,
            type: 'DELETE'
        }).done(function(result) {
          $this.removeClass('btn-danger').addClass('btn-success');
          $this.find('i').removeClass('fa-times').addClass('fa-check');
          $this.append('<span>Deleted!</span>');
        })
    }
})