const WorkList = () => {
  return (
    <>
    <h2 className="pb-5">View All Works</h2>
    <form method="GET" action="">
        <div className="table-responsive table-mh">
            <table className="table table-borderless text-light">
                <thead className="bg-0">
                <tr>
                    <th scope="col">Related Document</th>
                    <th scope="col">Type</th>
                    <th scope="col">State</th>
                    <th scope="col">Create Date</th>
                    <th scope="col">Complete Date</th>
                    <th scope="col">Delegate User</th>
                    <th scope="col"></th>
                </tr>
                </thead>
                <tr>
                    <td>filter_forms.document }}</td>
                    <td>filter_forms.type }}</td>
                    <td>filter_forms.state }}</td>
                    <td></td>
                    <td></td>
                    <td>filter_forms.employee }}</td>
                    <td>
                        <button type="submit" className="btn btn-info btn-block">
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </td>
                </tr>
                {/* {% for work in works %} */}
                    <tr>
                        <td>
                            <a href="{% url 'work_detail' id=work.id %}">work }}</a>
                        </td>
                        {/* {% if work.get_type_display == 'Create' %} */}
                            <td><span className="badge badge-pill badge-success">work.get_type_display }}</span></td>
                        {/* {% elif work.get_type_display == 'Edit' %} */}
                            <td><span className="badge badge-pill badge-warning">work.get_type_display }}</span></td>
                        {/* {% elif work.get_type_display == 'Cancel' %} */}
                            <td><span className="badge badge-pill badge-danger">work.get_type_display }}</span></td>
                        {/* {% endif %} */}
                        <td>work.get_state_display }}</td>
                        <td>work.create_date }}</td>
                        {/* {% if work.complete_date == null %} */}
                            <td>-</td>
                        {/* {% else %} */}
                            <td>work.complete_date }}</td>
                        {/* {% endif %} */}
                        {/* {% if work.latest_delegate == null %} */}
                            <td>-</td>
                        {/* {% else %} */}
                            <td>
                                <a href="{% url 'profile-other' id=work.latest_delegate.user_id %}">work.latest_delegate }}</a>
                            </td>
                        {/* {% endif %} */}
                        <td>
                            <a href="{% url 'work_detail' id=work.id %}">
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
    </>
  );
};

export default WorkList;
