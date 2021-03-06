// Storage Controller
const StorageCtrl = (function(){
  //Public methods
  return{
    storeItem: function(item){
      let items;
      //Check if anything in localstorage
      if(localStorage.getItem('items') === null){
        items = [];
        items.push(item);
        //Set localStorage
        //local storage can hold only strings - convert anything into string
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        //Get what is already there in localStorage
        items = JSON.parse(localStorage.getItem('items'));
        //Push new item
        items.push(item);
        //REset localStorage
        localStorage.setItem('items', JSON.stringify(items))
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromLocalStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();


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
    // items: [
    //   // {id:0, name: 'Steak Dinner', calories: 1200},
    //   // {id:1, name: 'Cookie', calories: 90},
    //   // {id:2, name: 'Egss', calories: 220}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
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
    getItemById: function(id){
      let found = null;
      //Loop through the items
      state.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories){
      //Calorie to a number
      calories = parseInt(calories);

      let found = null;

      state.items.forEach(function(item){
        if(item.id === state.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id){
      //Get ids
      const ids = state.items.map(function(item){
        return item.id;
      });
      //Get index
      const index = ids.indexOf(id);
      //Remove index
      state.items.splice(index,1);
    },
    clearAllItemsState: function(){
      state.items = [];
    },
    setCurrentItem: function(item){
      state.currentItem = item;
    },
    getCurrentItem: function(){
      return state.currentItem;
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
    listItems: '#item-list li',
    clearBtn: '.clear-btn',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
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
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      //Turn nodelist into array
      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Callories</em>
              <a href="#" class="secondary-content"><i class="edit-item fas fa-pencil-alt"></i></a>`;
        }
      });
    },
    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemForm: function(){
      UICtrl.showEditState();
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
    },

    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);

      listItems.forEach(function(item){
        item.remove();
      });
    },

    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(total){
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function(){
      return UISelectors;
    }
  }
})();
//App Controller -- called right away
const App = (function(ItemCtrl, StorageCtrl, UICtrl){

  //Load Event listeners
  const loadEventListeners = function(){
    //Get UI Selectors first
    const UISelectors = UICtrl.getSelectors();

    //Add Item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //Disable enter for yet another submit of same item
    document.addEventListener('keypress', function(e){
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    //Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //Update Item Event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Delete Button Event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //Back Button Event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    //Clear all items on the page
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItems);

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
      //Store in local storage
      StorageCtrl.storeItem(newItem);
      //Clear fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  }

  //Item Update Submit Function
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')){
      //Get list item id (item-0, item-1) and break into an array
      const listId = (e.target.parentNode.parentNode.id).split('-');
      //Get the id and parse it into the number
      const id = parseInt(listId[1]);

      //Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      //Set currentItem
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemForm();
    }
    e.preventDefault();
  }

  //Update Item function
  const itemUpdateSubmit = function(e){
    //Get item input
    const input = UICtrl.getItemInput();

    //Update Item in State
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update UI
    UICtrl.updateListItem(updatedItem);

    //Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add totalCalories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Update localStorage
    StorageCtrl.updateItemStorage(updatedItem);

    //Clear edit state
    UICtrl.clearEditState();

    e.preventDefault();
  }

  //Delete Item
  const itemDeleteSubmit = function(e){
    //Get Current Item
    const currentItem = ItemCtrl.getCurrentItem();

    //Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    //Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    //Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add totalCalories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Delete from local storage
    StorageCtrl.deleteItemFromLocalStorage(currentItem.id);

    //Clear edit state
    UICtrl.clearEditState();

    e.preventDefault();
  }

//Clear all items on the page
  const clearAllItems = function(){
    //Delete all items from state
    ItemCtrl.clearAllItemsState();

    //Get the total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add totalCalories to UI
    UICtrl.showTotalCalories(totalCalories);

    //Delete all items from UI
    UICtrl.removeItems();

    //Clear from localStorage
    StorageCtrl.clearItemsStorage();

    //Hide UI
    UICtrl.hideList();

  }

  //Public methods
  return {
    init: function(){
      //Clear edit state/set initial Set
      UICtrl.clearEditState();
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
})(ItemCtrl, StorageCtrl, UICtrl);

//Initializing App
App.init();
