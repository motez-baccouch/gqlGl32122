export const Mutation = {
    addTodo: (parent, { ajoutTodoInput }, { db, pubsub }, infos) => {
      if (!existInArray(db.users, "id", ajoutTodoInput.userId)) { 
        throw new Error(`Le user d'id ${ajoutTodoInput.userId} n'existe pas`);
      } else {
        const newTodo = {
          id: db.todos.length ? db.todos[db.todos.length - 1].id + 1 : 1,
          status: "WAITING",
          ...ajoutTodoInput,
        };
        db.todos.push(newTodo);
        pubsub.publish("todo", { todo: { todo: newTodo, mutation: "ADD" } });
        return newTodo;
      }
   
    },
    updateTodo: (parent, { id, modifierTodoInput }, { db, pubsub }, infos) => {  
      if (
        modifierTodoInput.userId &&
        !existInArray(db.users, "id", modifierTodoInput.userId)
      ) {
        throw new Error(`Le user d'id ${modifierTodoInput.userId} n'existe pas`);
      } else {
        const todo = db.todos.find((todoItem) => todoItem.id === id);
        if (!todo) {
          throw new Error(`Le todo d'id ${id} n'existe pas`);
        } else {
          for (let key in modifierTodoInput) {
            todo[key] = modifierTodoInput[key];
          }
          pubsub.publish("todo", { todo: { todo, mutation: "UPDATE" } });
          return todo;
        }
      }
    },
    deleteTodo: (parent, { id }, { db, pubsub }, infos) => {
      const indexTodo = db.todos.findIndex((todo) => todo.id === id);
      if (indexTodo === -1) {
        throw new Error("Todo innexistant");
      } else {
        const [todo] = db.todos.splice(indexTodo, 1);
        pubsub.publish("todo", { todo: { todo, mutation: "DELETE" } });
        return todo;
      }
    },
  };
  
  function existInArray(array, attribut, value) {
    console.log(array, attribut, value);
    return array.some((element) => element[attribut] == value);
  }