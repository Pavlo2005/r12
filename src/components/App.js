import { useEffect, lazy } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './Layout';
import { PrivateRoute } from './PrivateRoute';
import { RestrictedRoute } from './RestrictedRoute';
import { refreshUser } from 'redux/auth/operations';
import { useAuth } from 'hooks';

const HomePage = lazy(() => import('../pages/Home'));
const RegisterPage = lazy(() => import('../pages/Register'));
const LoginPage = lazy(() => import('../pages/Login'));
const TasksPage = lazy(() => import('../pages/Tasks'));

// 1. Регистрируюсь OK
// 2. В ответе пришел ТОКЕН
// 3. Токен пишем в Редакс
// 4. Токен автоматически пишется в LS

// 1. При каждом монтирвоании App, персист записывает значение токена из LS в Redux
// 2. Если токена нет, ничего не делаем. Если токен есть, запускается операция refresh, isRefreshing ставится в true
// 3. По результату рефреша, ставим isRefreshing false, при этом пишем данные в user и isLoggedIn true

// 1. мы были залогинены и заходим на страницу tasks
// 2. Персист кидает токен в редакс
// 3. Запускается refresh, потом что есть токен, isRefreshing true
// 4. Завершается запрос, успешно, isRefreshing false, isLoggedIn true
// 5. Рендерятся Routes
// 6. Для /tasks подходит <PrivateRoute redirectTo="/login" component={<TasksPage />} />
// 7. Приватный route принимает решение, мы залогинены? - ДА!
// 8. Приватный route рендерит TasksPage

// 1. Нажимаем Logout на странице /tasks, запускается операция logout, удаляется токен из хедера
// 2. Логаут успешный, мы все еще на /tasks
// 3. <PrivateRoute redirectTo="/login" component={<TasksPage />} /> принимает решение
// 4. Мы разлогинены, поэтому нас кидает на /login

export const App = () => {
  const dispatch = useDispatch();
  const { isRefreshing } = useAuth();

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return isRefreshing ? (
    <b>Refreshing user...</b>
  ) : (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="/register"
          element={
            <RestrictedRoute redirectTo="/tasks" component={<RegisterPage />} />
          }
        />
        <Route
          path="/login"
          element={
            <RestrictedRoute redirectTo="/tasks" component={<LoginPage />} />
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute redirectTo="/login" component={<TasksPage />} />
          }
        />
      </Route>
    </Routes>
  );
};
