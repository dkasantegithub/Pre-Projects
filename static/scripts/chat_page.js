document.addEventListener('DOMContentLoaded', () => {
      // Make sidebar collapse on click
      document.querySelector('#show-sidebar-button').onclick = () => {
        document.querySelector('#sidebar').classList.toggle('view-sidebar');
    };

    // make 'enter' key submit message
    let msg = document.querySelector('#user');
    msg.addEventListener('keyup', function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.querySelector('#send').click();
        }
    });

});