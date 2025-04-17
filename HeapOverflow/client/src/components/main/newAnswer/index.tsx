import './index.css';
import Form from '../baseComponents/form';
import TextArea from '../baseComponents/textarea';
import useAnswerForm from '../../../hooks/useAnswerForm';
import CreateAccountPrompt from '../../createAccountPrompt';

/**
 * NewAnswerPage component allows users to submit an answer to a specific question.
 */
const NewAnswerPage = () => {
  const { text, textErr, setText, postAnswer, isPromptOpen, setIsPromptOpen } = useAnswerForm();

  return (
    <Form>
      <div>
        <TextArea
          title={'Answer Text'}
          id={'answerTextInput'}
          val={text}
          setState={setText}
          err={textErr}
        />
      </div>
      <div className='btn_indicator_container'>
        <button className='form_postBtn' onClick={postAnswer}>
          Post Answer
        </button>
        <div className={`mandatory_indicator`}>* indicates mandatory fields</div>
      </div>
      <CreateAccountPrompt isOpen={isPromptOpen} onClose={() => setIsPromptOpen(false)} />
    </Form>
  );
};

export default NewAnswerPage;
