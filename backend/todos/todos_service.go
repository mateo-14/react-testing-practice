package todos

type TodosService interface {
	CreateTodo(title string, userId int) (Todo, error)
	GetTodos(userId int) ([]Todo, error)
	CompleteTodo(id int, userId int) error
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
	todos, err := t.todosRepository.GetTodos(userId)
	if err != nil {
		return nil, err
	}

	return todos, nil
}

func (t todosService) CompleteTodo(id int, userId int) error {
	err := t.todosRepository.CompleteTodo(id, userId)
	if err != nil {
		return err
	}

	return nil
}
