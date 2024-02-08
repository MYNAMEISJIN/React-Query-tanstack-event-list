import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { createNewEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { queryClient } from "../../util/http.js";

export default function NewEvent() { //POST요청하기
  const navigate = useNavigate();
  const { mutate, isPending, isError, error } = useMutation({
    //mutationKey// useQuery get 요청과 다르게 useMustation은 키값이 필요없다. 왜냐하면 캐시가 필요없어서
    mutationFn: createNewEvent, //함수
    //useMutation은 useQuery와 달리 자동으로 request 하지 않고 개발자기 직접 request를 언제 할지 보내줘야한다.
    //그걸 mutate 가 한다.

    onSuccess:() =>{ // 성공적으로 다 끝나고 다음에 실행 되는 함수.
      queryClient.invalidateQueries({queryKey: ['events']})
      //기존 데이터가 오래 되었으니 그 데이터를 즉시 업데이트 시키라는 invalidateQueries. key를 입력하여 어떤 데이터를 요청할지 말해준다.
      navigate("/events") //그래서 여기 쓰면 오류가 없다고 판단하고 넘어 갈 수 있다. 
    }

  });

  function handleSubmit(formData) {
    mutate({ event: formData });
    //navigate 여기에 이렇게 내비하면 오류가 났는지 알 수 가 없다. 
  }
  
  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={error.info?.message ||"Failed to create event. Please check your inputs and tyr again later"}
        />
      )}
    </Modal>
  );
}
