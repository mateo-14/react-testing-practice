package todos

type TodosService interface {
	CreateTodo(title string, userId int) (Todo, error)
	GetTodos(userId int) ([]Todo, error)
	CompleteTodo(id int, userId int) error
	UncompleteTodo(id int, userId int) error
	DeleteTodo(id int, userId int) error
}

type todosService struct {
	todosRepository TodosRepository
}

func NewTodosService(todosRepository TodosRepository) TodosService {
	return &todosService{
		todosRepository: todosRepository,
	}
}

func (t todosService) CreateTodo(title string, userId int) (Todo, error) {
	err := t.todosRepository.Add(title, userId)
	if err != nil {
		return Todo{}, err
	}

	return Todo{
		Title: title,
	}, nil
}

func (t todosService) GetTodos(userId int) ([]Todo, error) {
	return t.todosRepository.GetAll(userId)
}

func (t todosService) CompleteTodo(id int, userId int) error {
	return t.todosRepository.Update(id, userId, map[string]interface{}{"is_completed": true})
}

func (t todosService) UncompleteTodo(id int, userId int) error {
	return t.todosRepository.Update(id, userId, map[string]interface{}{"is_completed": false})
}

func (t todosService) DeleteTodo(id int, userId int) error {
	return t.todosRepository.Delete(id, userId)
}
