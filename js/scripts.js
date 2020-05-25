var pokemonRepository = (function () {
    var pokemonList = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

  function getAll() {
    return pokemonList;
  }

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function addListItem(pokemon) {
    var pokeList = $('#pokemon-list');
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
    var modalBody = $('.modal-body');
    var modalTitle = $('.modal-title');
    modalBody.empty();
    modalTitle.empty();

    //Add modal content
    // Add character name to modal
    var nameElement = $('<h1>' + item.name + '</h1>');

    // Add character height
    var heightElement = $('<p>' + "Height: " + item.height + " m" + '</p>');

    // Add character type(s)
    var typeElement = $('<p>' + "Type: " + item.types + '</p>');

    // Add character image
    var imageElement = $('<img src ='+ item.imageUrl +'>');

    modalTitle.append(nameElement);
    modalBody.append(heightElement);
    modalBody.append(typeElement);
    modalBody.append(imageElement);
  };

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal
  }
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
