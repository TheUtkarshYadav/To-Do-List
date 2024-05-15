import { useEffect, useState } from 'react';
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import axios from "axios";
import Auth from "./components/Auth";
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies.Email;
  const authToken = cookies.AuthToken;
  const [tasks, setTasks] = useState(null);

  const getData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/todos/${userEmail}`);
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (authToken) {
      getData()
    }
  }, []
  );

  console.log(tasks);

  // Sort tasks by date
  const sortedTasks = tasks?.slice().sort((a, b) => (
    new Date(a.date) - new Date(b.date)
  ));

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken &&
        <>
          <ListHeader listName={'🌞 To-do List'} getData={getData} />
          <p className="user-email">Welcome {userEmail}!</p>
          {sortedTasks?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </>
      }
      <p className="copyright">© UTKAR8H Pvt. Ltd. {new Date().getFullYear()}</p>
    </div>
  );
}

export default App;
