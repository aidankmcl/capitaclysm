import { Layout } from "~/ui";
import { actions, useAppDispatch } from "~/store";
import { useEffect, useRef } from "react";

export const Test = () => {
  const dispatch = useAppDispatch();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      dispatch(actions.game.newGame());
      initRef.current = true;
    }
  }, [initRef, dispatch]);

  return <Layout>
    <div className="h-[80vh] w-[80vh]">
      <div>Map placeholder - will be replaced with new mapping solution</div>
    </div>
  </Layout>;
};
