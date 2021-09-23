$(document).ready(() => {
  const pageURL = $(location).attr("href");
  const splitPageURL = pageURL.split('/');
  const mapID = splitPageURL[splitPageURL.length - 1];
  // console.log(mapID);

  $.get(`/favourites/${mapID}`, function(data) {
    // console.log(data);
    if (data) {
      $("i").toggle();
    }
  });


  $("#fav-active").click(() => {
    const pageURL = $(location).attr("href");
    const splitPageURL = pageURL.split('/');
    //The url for a map looks like ->    domain.com/maps/MAP_ID
    // Dividing that using "/" splits it in two elements: domain.com, maps AND MAP_ID;
    // The last element will be the map id.
    const mapID = splitPageURL[splitPageURL.length - 1];
    //console.log(mapID);

    $.post(`/favourites/${mapID}/delete`, function() {
        // Using SweetAlert library to show messages to users.
        // Docs: https://sweetalert2.github.io/#icons
      Swal.fire({
        icon: 'error',
        title: 'Your favourite has been removed',
        showConfirmButton: false,
        timer: 1500
      });
      $("i").toggle();
    });

  // here
  });

  $("#fav-inactive").click(() => {
    const pageURL = $(location).attr("href");
    const splitPageURL = pageURL.split('/');
    const mapID = splitPageURL[splitPageURL.length - 1];
    // console.log(mapID);

    $.post(`/favourites/${mapID}`, function() {
      // Using SweetAlert library to show messages to users.
      // Docs: https://sweetalert2.github.io/#icons
      Swal.fire({
        icon: 'success',
        title: 'Your favourite has been saved',
        showConfirmButton: false,
        timer: 1500
      });
      $("i").toggle();
    });
  });

});
