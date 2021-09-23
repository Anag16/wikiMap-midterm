$( ".delete_form" ).submit(function( event ) {
  // alert( "Handler for .submit() called." );
  event.preventDefault();

  Swal.fire({
    title: 'Are you sure you want to delete this map?',
    icon: 'question',
    showDenyButton: true,
    confirmButtonText: 'Delete Map',
    denyButtonText: `Cancel`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      $.ajax({
        method: "POST",
        url: `/maps/${this[0].value}/delete`,
        data: $(this).serialize()
      }).done(function() {
        Swal.fire({
          title: 'Done',
          text: 'Your map has been deleted',
          icon: 'success',
          showDenyButton: false,
          confirmButtonText: 'Ok'
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
            location.reload();
        });
      }).fail(function(){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      });
    } else if (result.isDenied) {

    }
  })
});
