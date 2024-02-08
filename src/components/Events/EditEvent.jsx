import { Link, useNavigate, useParams } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../util/http.js";

export default function EditEvent() {
  // edit
  const navigate = useNavigate();
  const params = useParams();

  const { data, isPending, isError, error } = useQuery({
    //기존 데이터 가지고 오기
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      //onSuccess는 mutate가 안전하게 끝나면 실행되는 것과 달리
      //onMutate는 mutate가 실행 되는 동시에 실행이 된다.
      console.log(data.event);

      const newEvent = data.event; // handleSubmit에서 넣은 데이터를 가져온것

      await queryClient.cancelQueries({ queryKey: ["events", params.id] }); //업데이트 하게 보내는거

      const previousEvent = queryClient.getQueryData(["events", params.id]); //이녀석은
      //업데이트 말고 지금 저장되어 있는 데이터 잡기 (오류잡기 위한거)

      queryClient.setQueryData(["events", params.id], newEvent); //이녀석은
      //서버의 응답을 기다리지 않고 내부적으로 수정한다.

      return { previousEvent: previousEvent };
    },
    onError: (error, data, context) => {
      //에러났을때 대처하기
      queryClient.setQueryData(["events", params.id], context.previousEvent);
    },

    onSettled: () => {
      // mutate이 끝나면 성공 실패 여부와 상관없이 항상 실행된다.(끝나면 무조건 실행)
      queryClient.invalidateQueries(["events", params.id]);
      // 성공 여부와 상관없이 백앤드와 프론트의 데이터를 비교 하여 틀리면 백엔드의 데이터로 강제 바꾼다.
    },
  });

  function handleSubmit(formData) {
    mutate({ id: params.id, event: formData });
    console.log("helsdsd");
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to lead event"
          message={
            error.info?.message ||
            "Failed to lead event. Please check your inputs and try again later."
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}

export function loader({ params }) {//react router 와 tanstack 합치기 //get 요청
  return queryClient.fetchQuery({//tanstack으로 fetch
    queryKey: ["events", params.id], //위에꺼랑 똑같이 하면된다.
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }), //위에꺼랑 똑같이 하면된다.
  });
}
//react router 에서 제공하는 loading 을 사용해도 되니까 tanstack에서 사용하는 isPending 사용 안해도된다.



export async function action({request, params}){ //데이터 보내기
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);

  await updateEvent({id:params.id, event:updatedEventData}); // tanstack
}
