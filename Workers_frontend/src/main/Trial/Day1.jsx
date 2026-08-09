import React, { useEffect, useState } from 'react'

function Day1() {

  const [counter,setcounter]=useState(0);
  const [isvisible,setisvisible]=useState(false);
  const [text,setText]=useState('');
  const [users,setusers]=useState([]);

  function goup(){
    setcounter(counter+1);
  }
  function godown(){
    if(counter<=-5){
      console.log(counter);
      setcounter(counter);
    }
    else{
    setcounter(counter-1);
    }
    // setcounter(counter-1);
  }


  function togglebar(){
      setisvisible(!isvisible);
  }

  function wordlimit(e){
    let word=e.target.value;
    let len=word.length;
    if(len>20){
      setText(word.substring(0,20));
      alert("only 20 char allowed")
    }
    else{
      setText(word);
    }

  }

    useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/users')
    .then(resp=>resp.json())
    .then(data=>setusers(data))
  },[]);


  return (
    < >
    <p className='flex justify-center bg-slate-500 font-bold text-lg'>DAY 1</p>
    <div>
      <div className='p-4'>
        {`count ${counter}`}
      </div>
        <div  className='flex '>
    <div className='bg-blue-400 inline-block rounded-md mr-4 p-2'>
      <button onClick={()=>{goup()}}>{`count +1`}</button>
    </div>
    <div className='bg-blue-400 inline-block rounded-md mr-4 p-2 hover:shrink-4'>
      <button onClick={()=>{godown()}}>{`count -1`}</button>
    </div>
    <div className='bg-red-500 inline-block rounded-md mr-4 p-2 hover:shrink-4'>
      <button onClick={()=>{setcounter(0)}}>Reset</button>
    </div>
    </div>

    {/* making and hiding the toggle bar  */}

    <div className='pt-4 flex pb-4'>
      <div>
        <button className='inline-block bg-slate-400 p-2 rounded-full' onClick={()=>togglebar()}>open-list</button>
      </div>
      {isvisible && <ul className=''><ol className='bg-green-400 rounded-md m-2 '>cleaning</ol> <ol className='bg-purple-400 rounded-md m-2 '>sweeping</ol> <ol className='bg-pink-400 rounded-md m-2' >catering</ol></ul> }
    </div>
    </div>
    

    <div className='pb-4'>
      <div className='flex'>
        value limiter :<input type="text" value={text} placeholder='type here'  className='bg-slate-300  text-black placeholder-slate-600 rounded-md p-1'  onChange={e=>wordlimit(e)} />
        <div className='pl-2'>{`word count:${text?text.length:0}`}</div>
      </div>
    </div>


    <div>
          <p className='flex justify-center bg-slate-500 font-bold text-lg'>DAY 2</p>

      <div>
        <ul>
          {users.map((user)=>(
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </div>


    </>
  )
}

export default Day1