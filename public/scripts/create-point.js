function sortByName(arr) {
  return arr.sort((init, final) => {
    if (init.nome < final.nome) {
      return -1;
    } else if (init.nome > final.nome) {
      return 1;
    } else {
      return 0;
    }
  });
}

function populateUFs() {
  const ufSelect = document.querySelector('select[name=uf]');

  fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(res => res.json())
    .then(states => {
      const sortedStates = sortByName(states);
      sortedStates.map(state => {
        ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`;
      });
      // for (const state of states) {
      //   ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`;
      // }
    });
}

populateUFs();

function getCities(event) {
  console.log(event.target.selectedIndex);
  const citySelect = document.querySelector('[name=city]');
  const stateInput = document.querySelector('[name=state]');

  const ufValue = event.target.value;

  const indexOfSelectedState = event.target.selectedIndex;
  stateInput.value = event.target.options[indexOfSelectedState].text;

  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

  fetch(url)
    .then(res => res.json())
    .then(cities => {
      citySelect.innerHTML = '<option value="">Selecione a Cidade</option>';
      citySelect.disabled = false;

      for (const city of cities) {
        citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`;
      }
    });
}

document.querySelector('select[name=uf]').addEventListener('change', getCities);

//Itens de Coleta

const itemsToCollect = document.querySelectorAll('.items-grid li');

for (const item of itemsToCollect) {
  item.addEventListener('click', handleSelectedItem);
}

const collectedItems = document.querySelector('input[name=items]');
let selectItems = [];

function handleSelectedItem(event) {
  const itemLi = event.target;

  //adicionar uma classe com JS
  itemLi.classList.toggle('selected');

  const itemId = itemLi.dataset.id;

  //Verificar se existem "items" selecionados, se sim pegar os "items" selecionados.

  const alreadySelected = selectItems.findIndex(item => item == itemId);

  //Se já estiver selecionado , tirar da selecao
  if (alreadySelected >= 0) {
    const filteredItems = selectItems.filter(item => {
      const itemIsDifferent = item != itemId;
      return itemIsDifferent;
    });
    selectItems = filteredItems;
  } else {
    //Se não estiver selecionado, adicionar a selecao
    selectItems.push(itemId);
  }

  //atualizar o campo escondido com os "items" selecionados
  collectedItems.value = selectItems;
}
