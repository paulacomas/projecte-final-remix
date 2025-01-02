import { FC } from "react";

// Definir las propiedades del componente (que recibirán los valores de los filtros y los cambios)
interface BookFiltersProps {
  title: string;
  user: string;
  category: string;
  categories: string[];
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUserChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSearch: (e: React.FormEvent) => void;
}

const BookFilters: FC<BookFiltersProps> = ({
  title,
  user,
  category,
  categories,
  onTitleChange,
  onUserChange,
  onCategoryChange,
  onSearch,
}) => {
  return (
    <form
      onSubmit={onSearch}
      className="space-y-6 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-4"
    >
      {/* Contenedor con Flexbox para los campos */}
      <div className="flex flex-wrap gap-6">
        {/* Filtro por Título */}
        <div className="flex-1 min-w-[250px]">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Buscar por título
          </label>
          <input
            type="text"
            id="title"
            placeholder="Ingrese el título"
            value={title}
            onChange={onTitleChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtro por Usuario */}
        <div className="flex-1 min-w-[250px]">
          <label
            htmlFor="user"
            className="block text-sm font-medium text-gray-700"
          >
            Buscar por usuario
          </label>
          <input
            type="text"
            id="user"
            placeholder="Ingrese el nombre de usuario"
            value={user}
            onChange={onUserChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtro por Categoría */}
        <div className="flex-1 min-w-[250px]">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Seleccionar categoría
          </label>
          <div className="flex items-center gap-4">
            {" "}
            {/* Aquí se coloca el contenedor flex */}
            <select
              id="category"
              value={category}
              onChange={onCategoryChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BookFilters;
