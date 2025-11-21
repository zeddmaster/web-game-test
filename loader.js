document.addEventListener('DOMContentLoaded', function() {

    // Hide loader
    setTimeout(() => {
  		const loader = document.getElementById('loader');
  		if(loader)
        	loader.classList.add('hidden')
    }, 1500)

});