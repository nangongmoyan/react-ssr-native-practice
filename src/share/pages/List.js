import React, { useEffect } from "react";
import { fetchUser } from "../store/actions/user.action";
import { useDispatch, useSelector } from "react-redux";
function List () {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user);


  useEffect(() => {
    dispatch(fetchUser())
  }, [])

  return (
    <div>
      list page works
      <ul>
        {user.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

function loadData (store) {
  return store.dispatch(fetchUser())
}

export default {
  component: List,
  loadData,
};
