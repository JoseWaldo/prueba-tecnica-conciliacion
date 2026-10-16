from app.models.example_model import ExampleModel


class ExampleService:
    def get_message(self) -> str:
        return ExampleModel(message="Hola desde Flask").message
