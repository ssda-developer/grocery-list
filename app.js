const CLASSES = {
    form: 'grocery__form',
    alert: 'grocery__alert',
    input: 'grocery__input',
    submitBtn: 'grocery__submit-btn',
    container: 'grocery__container',
    containerVisible: 'grocery__container--visible',
    list: 'grocery__list',
    clearBtn: 'grocery__clear-btn',
    item: 'grocery__item',
    itemTitle: 'grocery__item-title',
    itemEditing: 'grocery__item--editing',
    btnContainer: 'grocery__btn-container',
    editBtn: 'grocery__edit-btn',
    deleteBtn: 'grocery__delete-btn'
};

class GroceryListApp {
    constructor() {
        this.form = document.querySelector(`.${CLASSES.form}`);
        this.alert = document.querySelector(`.${CLASSES.alert}`);
        this.input = document.querySelector(`.${CLASSES.input}`);
        this.submitBtn = document.querySelector(`.${CLASSES.submitBtn}`);
        this.container = document.querySelector(`.${CLASSES.container}`);
        this.list = document.querySelector(`.${CLASSES.list}`);
        this.clearBtn = document.querySelector(`.${CLASSES.clearBtn}`);

        this.editElement = null;
        this.editFlag = false;
        this.editID = '';

        this.addEventListeners();
    }

    addEventListeners() {
        this.form.addEventListener('submit', this.addItem.bind(this));
        this.clearBtn.addEventListener('click', this.clearItems.bind(this));
        window.addEventListener('DOMContentLoaded', this.setupItems.bind(this));
    }

    addItem(e) {
        e.preventDefault();
        const value = this.input.value.trim();
        const id = new Date().getTime().toString();

        if (value && !this.editFlag) {
            this.createListItem(id, value);
            this.displayAlert('Item added to the list', 'success');
            this.container.classList.add(CLASSES.containerVisible);
            this.addToLocalStorage(id, value);
            this.setBackToDefault();
        } else if (value && this.editFlag) {
            this.editElement.textContent = value;
            this.displayAlert('Value changed', 'success');
            this.editLocalStorage(this.editID, value);
            this.setBackToDefault();
        } else {
            this.displayAlert('Please enter value', 'danger');
        }
    }

    displayAlert(message, type) {
        this.alert.textContent = message;
        this.alert.className = `${CLASSES.alert} ${CLASSES.alert}--${type}`;

        setTimeout(() => {
            this.alert.textContent = '';
            this.alert.className = CLASSES.alert;
        }, 1000);
    }

    clearItems() {
        const items = this.list.querySelectorAll(`.${CLASSES.item}`);

        items.forEach(item => this.list.removeChild(item));
        this.container.classList.remove(CLASSES.containerVisible);
        this.displayAlert('Empty list', 'danger');
        this.setBackToDefault();
        localStorage.removeItem(CLASSES.list);
    }

    deleteItem(e) {
        const item = e.currentTarget.closest(`.${CLASSES.item}`);
        const id = item.dataset.id;

        this.list.removeChild(item);

        if (!this.list.children.length) {
            this.container.classList.remove(CLASSES.containerVisible);
        }

        this.displayAlert('Item removed', 'danger');
        this.setBackToDefault();
        this.removeFromLocalStorage(id);
    }

    editItem(e) {
        const item = e.currentTarget.closest(`.${CLASSES.item}`);

        this.editElement = item.querySelector(`.${CLASSES.itemTitle}`);
        this.input.value = this.editElement.textContent;
        this.editFlag = true;
        this.editID = item.dataset.id;
        this.submitBtn.textContent = 'Edit';
        item.classList.add(CLASSES.itemEditing);
    }

    setBackToDefault() {
        const editingItem = this.list.querySelector(`.${CLASSES.itemEditing}`);

        if (editingItem) {
            editingItem.classList.remove(CLASSES.itemEditing);
        }

        this.input.value = '';
        this.editFlag = false;
        this.editID = '';
        this.submitBtn.textContent = 'Submit';
        this.input.focus();
    }

    addToLocalStorage(id, value) {
        const item = {id, value};
        const items = this.getLocalStorage();

        items.push(item);
        localStorage.setItem(CLASSES.list, JSON.stringify(items));
    }

    getLocalStorage() {
        return JSON.parse(localStorage.getItem(CLASSES.list)) || [];
    }

    removeFromLocalStorage(id) {
        const items = this.getLocalStorage().filter(item => item.id !== id);

        localStorage.setItem(CLASSES.list, JSON.stringify(items));
    }

    editLocalStorage(id, value) {
        const items = this.getLocalStorage().map(item =>
            item.id === id ? {...item, value} : item
        );

        localStorage.setItem(CLASSES.list, JSON.stringify(items));
    }

    setupItems() {
        const items = this.getLocalStorage();

        if (items.length) {
            items.forEach(item => this.createListItem(item.id, item.value));
            this.container.classList.add(CLASSES.containerVisible);
        }
    }

    createListItem(id, value) {
        const article = document.createElement('article');

        article.classList.add(CLASSES.item);
        article.setAttribute('data-id', id);
        article.innerHTML = `
            <p class="${CLASSES.itemTitle}">${value}</p>
            <div class="${CLASSES.btnContainer}">
                <button type="button" class="${CLASSES.editBtn}">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="${CLASSES.deleteBtn}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        article.querySelector(`.${CLASSES.editBtn}`).addEventListener('click', this.editItem.bind(this));
        article.querySelector(`.${CLASSES.deleteBtn}`).addEventListener('click', this.deleteItem.bind(this));
        this.list.appendChild(article);
    }
}

new GroceryListApp();
