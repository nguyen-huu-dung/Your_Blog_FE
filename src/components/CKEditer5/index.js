import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './index.scss';

const toolbarConfig = {
    'blog': ['heading', '|',
    'bold', 'italic', 'link', '|',
    'bulletedList', 'numberedList', '|',
    'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', '|',
    'uploadImage', 'mediaEmbed', 'blockQuote', '|',
    'undo', 'redo'],
    'forum-blog': ['italic', 'blockQuote', '|', 'bulletedList', 'numberedList', '|', 'link', 'uploadImage', '|', 'undo', 'redo']
}

const CKE5Input = ({readOnly, type, descriptionContent, setDescriptionContent}) => {

    return (
        <CKEditor
        editor={ ClassicEditor }
        config={{         
            toolbar: toolbarConfig[type],
            ckfinder: {
                // Upload the images to the server using the CKFinder QuickUpload command.
                uploadUrl: `${process.env.REACT_APP_URL_BE}/images`
            }
          }}     
        data={descriptionContent}
        onReady={(editor) =>  {
            if(readOnly) {
                editor.isReadOnly = true;
                editor.ui.view.toolbar.element.style.display = 'none';
            }
        }}
        onChange={ ( event, editor ) => {
            const data = editor.getData();
            setDescriptionContent(data);
        } }
    />
    )
}

export default CKE5Input;