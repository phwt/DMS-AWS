import axios from "axios";
import { Form } from "react-bootstrap";
import { useCallback } from "react";

export const getServerSideProps = async (ctx) => {
  const { data } = await axios.get(`${process.env.API_PATH}documents/`);

  return {
    props: {
      documents: data,
    },
  };
};

export const DocumentStateBadge = ({ state }) => {
  switch (state) {
    case "IN_PROGRESS":
      return <span className="badge badge-pill badge-info">In-Progress</span>;
    case "RELEASED":
      return <span className="badge badge-pill badge-success">Released</span>;
    case "OBSOLETE":
      return <span className="badge badge-pill badge-danger">Obsolete</span>;
    case "RECALLED":
      return <span className="badge badge-pill badge-warning">Recalled</span>;
  }
};

export const documentTypeText = (type) => {
  switch (type) {
    case "MANUAL":
      return "Manual";
    case "PROCEDURE":
      return "Procedure";
    case "WORK_INSTRUCTION":
      return "Work Instruction";
    case "FORM":
      return "Form";
  }
};

const DocumentList = ({ documents }) => {
  return (
    <>
      {/* {% block title %}{{ doc_type|title }} Document List{% endblock %} */}
      <div className="row no-gutters">
        <div className="col-6">
          <h2 className="pb-5">View Documents</h2>
        </div>
        <div className="col-6 text-right">
          Request to&nbsp;&nbsp;&nbsp;
          <a href="{% url 'work_create' %}" className="btn btn-sm btn-success">
            <i className="fa fa-plus"></i>&nbsp;&nbsp;Create
          </a>
          &nbsp;
          <a href="{% url 'work_edit' %}" className="btn btn-sm btn-info">
            <i className="fa fa-pencil-alt"></i>&nbsp;&nbsp;Edit
          </a>
          &nbsp;
          <a href="{% url 'work_cancel' %}" className="btn btn-sm btn-danger">
            <i className="fa fa-minus"></i>&nbsp;&nbsp;Cancel
          </a>
        </div>
      </div>

      <div className="table-responsive table-mh">
        <table className="table table-borderless text-light">
          <thead className="bg-0">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">State</th>
              <th />
            </tr>
          </thead>
          <tr>
            <td />
            <td>
              <Form.Control as="select" size="sm" />
            </td>
            <td>
              <Form.Control as="select" size="sm" />
            </td>
            <td />
          </tr>

          {documents.map((document) => (
            <tr>
              <td>{document.name}</td>
              <td>{documentTypeText(document.type)}</td>
              <td>
                <DocumentStateBadge state={document.state} />
              </td>
              <td>
                <button type="button" className="btn btn-block">
                  <i
                    className="fa fa-chevron-right text-info"
                    aria-hidden="true"
                  />
                </button>
              </td>
            </tr>
          ))}
        </table>
      </div>

      {/* {% if documents.has_other_pages %}
<nav>
	<ul class="pagination">
		{% if documents.has_previous %}
		<li class="page-item btn-dark">
			<a class="page-link" href="?page={{ documents.previous_page_number }}">&laquo;</a>
		</li>
		{% else %}
		<li class="disabled page-item">
			<a class="page-link" href="#">&laquo;</a>
		</li>
		{% endif %} {% for i in documents.paginator.page_range %} {% if
		documents.number == i %}
		<li class="active page-item active">
			<a class="page-link" href="#">{{ i }}</a>
		</li>
		{% else %}
		<li class="page-item">
			<a class="page-link" href="?page={{ i }}">{{ i }}</a>
		</li>
		{% endif %} {% endfor %} {% if documents.has_next %}
		<li class="page-item">
			<a class="page-link" href="?page={{ documents.next_page_number }}">&raquo;</a>
		</li>
		{% else %}
		<li class="disabled page-item">
			<a class="page-link" href="#">&raquo;</a>
		</li>
		{% endif %}
	</ul>
</nav>
{% endif %} */}
    </>
  );
};

export default DocumentList;
