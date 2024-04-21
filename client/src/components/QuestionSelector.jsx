import React from 'react'

function QuestionSelector( {qno, activeQuestionNo, setActiveQuestionNo} ) {
  return (
    <div className={`text-3xl rounded-lg mx-3 ${qno == activeQuestionNo ? 'bg-black text-orange-600':''} transition-all`}>
        {qno==1 &&  activeQuestionNo == 1
        ?
            <div>
                <input type='radio' name='questions' defaultChecked className='hidden'
                    onChange={() => setActiveQuestionNo(qno)} id={qno}></input>
                <label className='cursor-pointer p-4' htmlFor={qno}>{qno}</label>
            </div>
        :
            <div>
                <input type='radio' name='questions' className='hidden'
                onChange={() => setActiveQuestionNo(qno)} id={qno}></input>
                <label className='cursor-pointer p-4' htmlFor={qno}>{qno}</label>
            </div>
        }
    </div>
  )
}

export default QuestionSelector