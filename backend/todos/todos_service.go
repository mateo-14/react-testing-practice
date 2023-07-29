package todos

type TodosService interface {
	CreateTodo(title string, userId int) (Todo, error)
	GetTodos(userId int) ([]Todo, error)
	CompleteTodo(id int, userId int) error
	UncompleteTodo(id int, userId int) error
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
	err := t.todosRepository.AddTodo(title, userId)
	if err != nil {
		return Todo{}, err
	}

	return Todo{
		Title: title,
	}, nil
}

func (t todosService) GetTodos(userId int) ([]Todo, error) {
	return t.todosRepository.GetTodos(userId)
}

func (t todosService) CompleteTodo(id int, userId int) error {
	return t.todosRepository.CompleteTodo(id, userId)
}

func (t todosService) UncompleteTodo(id int, userId int) error {
	return t.todosRepository.UncompleteTodo(id, userId)
}
