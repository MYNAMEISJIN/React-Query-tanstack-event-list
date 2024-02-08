import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import LoadingIndicator from "../UI/LoadingIndicator";
import ErrorBlock from "../UI/ErrorBlock";
import fetchEvents from "../../util/http";
import EventItem from "./EventItem";

export default function FindEventSection() {
  //검색 요청
  const searchElement = useRef(); // value 값
  const [searchTerm, setSearchTerm] = useState();

  const { data, isLoading, isPending, isError, error } = useQuery({
    queryKey: ["events", { search: searchTerm }], //키 값은 NewEventSection과 동일한 부분이 있어 일케 놔두고, 하나더 추가
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }), //데이터가 들어가면 움직인다. // () => ()이렇게 하면 어떻게 동작할지 알려준다.
    enabled: searchTerm !== undefined, //이건 query 가 실행 할지 안할지 알려주는 거이다
    //boolean 으로 작동되고 기본값은 true
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content = <p>Please enter a search term and to find events.</p>;

  if (isLoading) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events"}
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
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
