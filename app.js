// Storage Controller
//Item Controller
const ItemCtrl = (function(){
  //Item Contructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure / State
  const state = {
    items: [
      // {id:0, name: 'Steak Dinner', calories: 1200},
      // {id:1, name: 'Cookie', calories: 90},
      // {id:2, name: 'Egss', calories: 220}
    ],
    currentItem: null,
    totalCalories: 0
  }
  //Public methods
  return{
    getItems: function(){
      return state.items;
    },
    addItem: function(name, calories){
      // Create ID
      let ID;
      if(state.items.length > 0){
        ID=state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //Calories to Number
      calories = parseInt(calories);
      //Generate new Item
      newItem = new Item(ID, name, calories);
      state.items.push(newItem);
      return newItem;
    },
    getTotalCalories: function(){
      let total = 0;

      state.items.forEach(function(item){
        total += item.calories;
      });
      //Set state totalCalories to the total calories of all items exist in the list
      state.totalCalories = total;
      return state.totalCalories;
    },
    logData: function(){
      return state;
    }
  }
})();
//UI Controller
const UICtrl = (function(){
  //UI Selectors
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }


  //Public methods
  return{
    populateItemList: function(items){
        let html='';
        items.forEach(function(item){
          html+= `<li class="collection-item" id="item-${item.id}"><strong>${item.name}: </strong><em>${item.calories} Callories</em>
              <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"></i></a>
            </li>`;
        });

        //Insert list Items
        document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function(){
      return{
        name:document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item){
      //Show listItem
      document.querySelector(UISelectors.itemList).style.display='block';
      //Create li element
      const li = document.createElement('li');
      //add a class
      li.className = 'collection-item';
      //add id
      li.id = `item-${item.id}`;
      //add html
      li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Callories</em>
          <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"></i></a>`;
      //Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(total){
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },
    getSelectors: function(){
      return UISelectors;
    }
  }
})();
//App Controller -- called right away
const App = (function(ItemCtrl, UICtrl){

  //Load Event listeners
  const loadEventListeners = function(){
    //Get UI Selectors first
    const UISelectors = UICtrl.getSelectors();

    //Add Item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
  }

  //Add Item itemAddSubmit
  const itemAddSubmit = function(e){
    //Get form input from UI Controller
    const input = UICtrl.getItemInput();
    //Check for name and calories input
    if(input.name !== '' && input.calories !== ''){
      //Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      //Add item to UI list
      UICtrl.addListItem(newItem);
      //Get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Add totalCalories to UI
      UICtrl.showTotalCalories(totalCalories);
      //Clear fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  }

  //Public methods
  return {
    init: function(){
      console.log('Initializing App...');
      //Fetch Items from data structure
      const items = ItemCtrl.getItems();
      //Check if any items
      if(items.length === 0){
        UICtrl.hideList();
      } else {
        //Populate list with items
        UICtrl.populateItemList(items);
      }
      //Get the total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Add totalCalories to UI
      UICtrl.showTotalCalories(totalCalories);
      //Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

//Initializing App
App.init();
