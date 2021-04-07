import { useRouter } from "next/router";

const Document = () => {
  const router = useRouter();
  const { documentId } = router.query;

  return <>
    <div>
      <h2 className="pb-5">Document Detail ID : {documentId} </h2>
      <h3> document.name </h3>
      <div className="col-6 pl-0">
        <table className="table table-borderless text-light">
          <tbody>
            <tr>
              <th scope="row">Version</th>
              <td> document.version </td>
            </tr>
            <tr>
              <th scope="row">Running No</th>
              <td> document.running_no </td>
            </tr>
            <tr>
              <th scope="row">Type</th>
              <td> document.get_type_display </td>
            </tr>
            <tr>
              <th scope="row">State</th>
              <td> document.get_state_display </td>
            </tr>
            <tr>
              <th scope="row">Creator</th>
              <td>
                <a href="{% url 'profile-other' id=document.creator.id %}">
                  document.creator
              </a>
              </td>
            </tr>
            <tr>
              <th scope="row">Parent Doc</th>
              {/* {% if document.parent_doc == None %}
                        <td> document.parent_doc </td>
            {% else %} */}
              <td>
                <a href="{% url 'doc_detail' id=document.parent_doc.id %}">
                  document.parent_doc
              </a>
              </td>
              {/* {% endif %} */}
            </tr>
          </tbody>

        </table>
      </div>

      <iframe src="/content/{{ document.file_location }}" width="100%" height="500px"></iframe>
    </div >
    <br /><br />
  </>;
};

export default Document;
