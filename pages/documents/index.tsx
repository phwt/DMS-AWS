const DocumentList = () => {
  return (
    <>
      {/* {% block title %}{{ doc_type|title }} Document List{% endblock %} */}
      <div className="row no-gutters">
        <div className="col-6">
          <h2 className="pb-5">View Internal Documents</h2>
        </div>
        <div className="col-6 text-right">
          Request to&nbsp;&nbsp;&nbsp;
		<a href="{% url 'work_create' %}" className="btn btn-sm btn-success"><i
            className="fa fa-plus"></i>&nbsp;&nbsp;Create</a>&nbsp;
          <a href="{% url 'work_edit' %}" className="btn btn-sm btn-info"><i className="fa fa-pencil"></i>&nbsp;&nbsp;Edit</a>&nbsp;
          <a href="{% url 'work_cancel' %}" className="btn btn-sm btn-danger"><i
            className="fa fa-minus"></i>&nbsp;&nbsp;Cancel</a>
        </div>
      </div>
      <form method="GET" action="">
        <div className="table-res ponsive table-mh">
          <table className="table table-borderless text-light">
            <thead className="bg-0">
              <tr>
                <th scope="col">Name</th>
                <th scope="col" className="fit">Version</th>
                <th scope="col" className="fit">Running No</th>
                <th scope="col">Type</th>
                <th scope="col">State</th>
                <th scope="col">Parent Doc</th>
                <th scope="col">Department</th>
                <th scope="col">Creator</th>
                <th></th>
              </tr>
            </thead>
            <tr>
              <td> filter.name </td>
              <td className="fit"> filter.version </td>
              <td className="fit"> filter.running_no </td>
              <td> filter.type </td>
              <td> filter.state </td>
              <td> filter.parent_doc </td>
              <td> filter.department </td>
              <td> filter.creator </td>
              <td>
                <button type="submit" className="btn btn-info btn-block">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
            {/* {% for document in documents %} loop Document List */}
            <tr>
              <td>
                <a href="{% url 'doc_detail' id=document.id %}"> doc.name </a>
              </td>
              <td className="fit text-center"> doc.version </td>
              <td className="fit text-center"> doc.running_no </td>
              <td> doc.get_type_display </td>

              {/* check state */}
              {/* {% if doc.get_state_display == 'Released' %}  */}
              <td>
                <span className="badge badge-pill badge-success"> doc.get_state_display </span>
              </td>
              {/* {% elif doc.get_state_display == 'In-Progress' %}
				<td>
					<span className="badge badge-pill badge-info"> doc.get_state_display </span>
				</td>
				{% elif doc.get_state_display == 'Obsoleted' %}
				<td>
					<span className="badge badge-pill badge-danger"> doc.get_state_display </span>
				</td>
				{% elif doc.get_state_display == 'Recalled' %}
				<td>
					<span className="badge badge-pill badge-warning"> doc.get_state_display </span>
				</td>
				{% endif %} */}

              {/* check parent null */}
              {/* {% if doc.parent_doc.id == null %}
				<td>-</td>
				{% else %} */}
              <td>
                <a href="{% url 'doc_detail' id=doc.parent_doc.id %}">
                  doc.parent_doc.name
					</a>
              </td>
              {/* {% endif %} */}
              <td> doc.dept_name </td>
              <td>
                <a href="{% url 'profile-other' id=doc.creator.id %}"> doc.creator </a>
              </td>
              <td>
                <a href="{% url 'doc_detail' id=doc.id %}">
                  <button type="button" className="btn btn-block">
                    <i className="fa fa-chevron-right text-info" aria-hidden="true"></i>
                  </button>
                </a>
              </td>
            </tr>
            {/* {% endfor %} */}
          </table>
        </div>
      </form>

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
