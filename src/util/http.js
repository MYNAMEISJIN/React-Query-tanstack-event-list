import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient()

export default async function fetchEvents({ signal, searchTerm, max }) { //tanstack을 이용한 get 요청(검색포함)
  let url = 'http://localhost:3000/events';



  if (searchTerm && max) { // max는 몇개 가지고 올꺼냐 묻는
    url = url + '?search=' + searchTerm + '&max=' + max;
  } else if (searchTerm) {
    url = url + '?search=' + searchTerm
  } else if(max){
    url= url + '?max=' + max
  }

  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;

}




export async function createNewEvent(eventData) { //post
  const response = await fetch(`http://localhost:3000/events`, {
    method: 'POST',
    body: JSON.stringify(eventData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('An error occurred while creating the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}




export async function fetchSelectableImages({ signal }) { //선택할 이미지 불러오기
  const response = await fetch(`http://localhost:3000/events/images`, { signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the images');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();

  return images;
}



export async function fetchEvent({ id, signal }) { //디테일 페이지 get 요청하기
  const response = await fetch(`http://localhost:3000/events/${id}`, { signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}



export async function deleteEvent({ id }) { //데이터 삭제하기 delete 요청
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = new Error('An error occurred while deleting the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}



export async function updateEvent({ id, event }) { // update 요청
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ event }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('An error occurred while updating the event');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}