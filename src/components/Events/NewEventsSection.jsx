import { useQuery } from "@tanstack/react-query";

import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import fetchEvents from "../../util/http.js";

export default function NewEventsSection() {
  //get 요청
  const { data, isPending, isError, error } = useQuery({//isLoading 대신 isPending
    queryKey: ["events", { max: 3 }], //데이터 재사용에 필요한 식별자
    queryFn: ({ signal }) => fetchEvents({ signal, max: 3 }), //query Function
    //queryFn: ({signal, queryKey})=> fetchEvents({signal, ...queryKey[1]}),
    //리액트 쿼리는 http 요청을 보내는 자체 코드는 없고 직접 작성 해야한다.
    //여기서는 fetchEvents 함수를 다른 폴더에 저장 하였다.

    staleTime: 0, //캐시에 데이터가 있을때 업데이트 된 데이터를 가져오기 위한 요청을
    //자체적으로 전송하기 전에 기다릴 시간을 설정하는 기본값은 0이다
    //이말은 캐시의 데이터를 사용하지만, 항상 업데이트 요청을 한다는
    //5000으로 설정 하면 5초뒤에 요청 한다는
    //gcTime: 0 //캐시데이터가 얼마뒤에 삭제되는지 알려주는 것
    //기본값은 5분이다. 5분뒤에 캐시에 저장된 데이터 값이 삭제 된다는 뜻
  });

  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (error) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events."}
      />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
