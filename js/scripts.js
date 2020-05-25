var pokemonRepository = (function () {
    var pokemonList = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
    var $modalContainer = $('#modal-container');

  function getAll() {
    return pokemonList;
  }

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function addListItem(pokemon) {
    var pokeList = $('ul');
    var listItem = $('<li></li>');

    //add button
    var button = $('<button type="btn" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">' + pokemon.name + '</button>');
    listItem.append(button);
    pokeList.append(listItem);

    //add Event Listener
    button.on('click', function() {
      showDetails(pokemon)
    });
  }

  //load API list
  function loadList() {
    return $.ajax(apiUrl, { dataType: 'json' }).then(function (responseJSON) {
      return responseJSON;
    }).then(function(json) {
      json.results.forEach(function(item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url,
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    });
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url, { dataType: 'json' }).then(function (responseJSON) {
      return responseJSON;
    }).then(function (details) {
      //add details to item
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = [];
      for (var i = 0; i < details.types.length; i++) {
        item.types.push(' ' + details.types[i].type.name);
      }
      }).catch(function (e) {
      console.error(e);
    })
  };

  function showDetails(item) {
    loadDetails(item).then(function () {
      showModal(item);
    });
  };

  // Create modal
  function showModal(item) {
    $modalContainer.empty();
    var modal = $('<div></div>');
      modal.addClass('modal');

    //Add modal content
    var closeButtonElement = $('<button>' + "Close" + '</button>');
    closeButtonElement.addClass('modal-close');
    closeButtonElement.on('click', hideModal);

    // Add character name to modal
    var nameElement = $('<h1>' + item.name + '</h1>');

    // Add character height
    var heightElement = $('<p>' + "Height: " + item.height + " m" + '</p>');

    // Add character type(s)
    var typeElement = $('<p>' + "Type: " + item.types + '</p>');

    // Add character image
    var imageElement = $('<img src ='+ item.imageUrl +'>');

    modal.append(closeButtonElement);
    modal.append(nameElement);
    modal.append(heightElement);
    modal.append(typeElement);
    modal.append(imageElement);
    $modalContainer.append(modal);

    $modalContainer.addClass('is-visible');
  };

  function hideModal() {
    $modalContainer.removeClass('is-visible');
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $modalContainer.addClass('is-visible')) {
      hideModal();
    }
  });

  $modalContainer.on('click', (e) => {
    var target = e.target;
    if (target === $modalContainer) {
      hideModal();
    }
  });

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
  }
})();


pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
