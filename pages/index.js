import React from "react";
// import { Button, Container } from "react-bootstrap";

export default function Home() {
  return (
    <>
      <h2 className="pb-5">Dashboard</h2>
      {/* {# Document Part #} */}
      <div className="row">
        <div className="col-3">
          <div
            className="card shadow py-2 bg-0 card-inter"
            // onClick="location.href='{% url 'internal_doc' %}'"
          >
            <div className="card-body">
              <div className="row">
                <div className="col-5 p-0">
                  <h5 className="mb-0" id="doc_cnt">
                    doc_cnt
                  </h5>
                </div>
                <div className="col-7 p-0">
                  <h3 className="card-title mb-0">Internal</h3>
                  <p className="card-text">Documents</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-3">
          <div
            className="card shadow  py-2 bg-0 card-in"
            // onClick="location.href='{% url 'internal_doc' %}?state=IN'"
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col-auto">
                  <i
                    className="fa fa-file text-info fa-3x "
                    aria-hidden="true"
                  ></i>
                </div>
                <div className="col ml-3">
                  <h3 className="card-title mb-0" id="doc_cnt_in">
                    doc_cnt_in
                  </h3>
                  <p className="card-text">In-Progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-3">
          <div
            className="card shadow  py-2 bg-0 card-re"
            // onClick="location.href='{% url 'internal_doc' %}?state=RE'"
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col-auto">
                  <i
                    className="fa fa-arrow-circle-right text-success fa-4x "
                    aria-hidden="true"
                  ></i>
                </div>
                <div className="col ml-3">
                  <h3 className="card-title mb-0" id="doc_cnt_re">
                    doc_cnt_re
                  </h3>
                  <p className="card-text">Released</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-3">
          <div
            className="card shadow  py-2 bg-0 card-ob"
            // onClick="location.href='{% url 'internal_doc' %}?state=OB'"
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col-auto">
                  <i
                    className="fa fa-ban text-danger fa-4x "
                    aria-hidden="true"
                  ></i>
                </div>
                <div className="col ml-3">
                  <h3 className="card-title mb-0" id="doc_cnt_ob">
                    doc_cnt_ob
                  </h3>
                  <p className="card-text">Obsoleted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {# Document list last 10 #} */}
        <div className="col-12 col-lg-6">
          <div className="bg-0 pl-3 pr-1 pt-2 mt-3">
            <div className="row">
              <div className="col-6">
                <h4 className="m-0">Internal</h4>
                <h4 className="m-0">Document</h4>
              </div>
              <div className="col-6 text-right">
                <button
                  onClick="updateInternalTable()"
                  className="btn text-muted"
                >
                  <i className="fa fa-refresh" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <p className="m-0 text-muted">Latest 10 Documents</p>
          </div>
          <table className="table table-borderless text-light" id="internal">
            <thead className="bg-0">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">State</th>
              </tr>
            </thead>
            <tbody>
              {/* {% for document in documents %} {# table internal doucument list in dashboard #} */}
              <tr>
                <td>
                  <a href="{% url 'doc_detail' id=document.id %}">
                    document.name|truncatechars:35
                  </a>
                </td>
                <td>document.get_type_display</td>
                {/* {% if document.get_state_display == 'Released' %} */}
                <td>
                  <span className="badge badge-pill badge-success">
                    document.get_state_display
                  </span>
                </td>
                {/* {% elif document.get_state_display == 'In-Progress' %} */}
                <td>
                  <span className="badge badge-pill badge-info">
                    document.get_state_display
                  </span>
                </td>
                {/* {% elif document.get_state_display == 'Obsoleted' %} */}
                <td>
                  <span className="badge badge-pill badge-danger">
                    document.get_state_display
                  </span>
                </td>
                {/* {% elif document.get_state_display == 'Recalled' %} */}
                <td>
                  <span className="badge badge-pill badge-warning">
                    document.get_state_display
                  </span>
                </td>
                {/* {% endif %} */}
              </tr>
              {/* {% endfor %} */}
            </tbody>
          </table>
        </div>
        {/* {# Document In-Progress last 10 #} */}
        <div className="col-6 col-lg-3">
          <div className="bg-0 pl-3 pr-1 pt-2 mt-3">
            <div className="row">
              <div className="col-9 pr-0">
                <h4>Internal Document</h4>
                <span className="badge badge-pill badge-info">In-Progress</span>
              </div>
              <div className="col-3 pl-0 text-right">
                <button
                  onClick="updateInternalTable()"
                  className="btn text-muted"
                >
                  <i className="fa fa-refresh" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
          <table className="table table-borderless text-light" id="progress">
            <thead className="bg-0">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
              </tr>
            </thead>
            <tbody>
              {/* {% for document_in in documents_in %} {# Inprogress #} */}
              <tr>
                <td>
                  <a href="{% url 'doc_detail' id=document_in.id %}">
                    document_in.name|truncatechars:20
                  </a>
                </td>
                <td className="text-center">document_in.type</td>
              </tr>
              {/* {% endfor %} */}
            </tbody>
          </table>
        </div>
        {/* {# Document Released last 10 #} */}
        <div className="col-6 col-lg-3">
          <div className="bg-0 pl-3 pr-1 pt-2 mt-3">
            <div className="row">
              <div className="col-9 pr-0">
                <h4>Internal Document</h4>
                <span className="badge badge-pill badge-success">Released</span>
              </div>
              <div className="col-3 pl-0 text-right">
                <button
                  onClick="updateInternalTable()"
                  className="btn text-muted"
                >
                  <i className="fa fa-refresh" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
          <table className="table table-borderless text-light" id="released">
            <thead className="bg-0">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
              </tr>
            </thead>
            <tbody>
              {/* {% for document_re in documents_re %} */}
              <tr>
                <td>
                  <a href="{% url 'doc_detail' id=document_re.id %}">
                    document_re.name|truncatechars:20
                  </a>
                </td>
                <td className="text-center">document_re.type</td>
              </tr>
              {/* {% endfor %} */}
            </tbody>
          </table>
        </div>
      </div>
      {/* {# Work Part #} */}
      <div className="row">
        {/* {# Work Overview #} */}
        <div className="col-12 col-lg-6 mb-3 mb-lg-0 row">
          <div className="col-6">
            <div
              className="card bg-0 mb-4 card-pointer"
              //   onClick="location.href='{% url 'work_list' %}'"
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-5 p-0 text-center">
                    <h1 className="font-l mb-0" id="work_cnt">
                      work_cnt
                    </h1>
                  </div>
                  <div className="col-7 p-0">
                    <p className="card-text m-0">Total</p>
                    <h5 className="card-title m-0">Works</h5>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card bg-warning card-pointer    "
              //   onClick="location.href='{% url 'work_list' %}?type=E'"
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-5 p-0 text-center">
                    <h1 className="font-l mb-0" id="work_cnt_e">
                      work_cnt_e
                    </h1>
                  </div>
                  <div className="col-7 p-0">
                    <p className="card-text m-0">Edit</p>
                    <h5 className="card-title m-0">Works</h5>
                  </div>
                </div>
              </div>
            </div>
            &nbsp;
            <div className="card bg-19">
              <div className="card-body">
                <div className="row">
                  <div className="col-5 p-0 text-center">
                    <u className="text-success">
                      <h1 className="font-l mb-0" id="work_cnt_cr_d">
                        work_cnt_cr_d
                      </h1>
                    </u>
                  </div>
                  <div className="col-7 p-0">
                    <h5 className="card-title m-0">Works</h5>
                    <p className="card-text m-0">Created Today</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-19">
              <div className="card-body">
                <div className="row">
                  <div className="col-5 p-0 text-center">
                    <u className="text-success">
                      <h1 className="font-l mb-0" id="work_cnt_cr_w">
                        work_cnt_cr_w
                      </h1>
                    </u>
                  </div>
                  <div className="col-7 p-0">
                    <h5 className="card-title m-0">Works</h5>
                    <p className="card-text m-0">Created this week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div
              className="card bg-success mb-4 card-pointer"
              //   onClick="location.href='{% url 'work_list' %}?type=CR'"
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-5 p-0 text-center">
                    <h1 className="font-l mb-0" id="work_cnt_cr">
                      work_cnt_cr
                    </h1>
                  </div>
                  <div className="col-7 p-0">
                    <p className="card-text m-0">Create</p>
                    <h5 className="card-title m-0">Works</h5>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="card bg-danger card-pointer"
              //   onClick="location.href='{% url 'work_list' %}?type=CA'"
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-5 p-0 text-center">
                    <h1 className="font-l mb-0" id="work_cnt_ca">
                      work_cnt_ca
                    </h1>
                  </div>
                  <div className="col-7 p-0">
                    <p className="card-text m-0">Cancel</p>
                    <h5 className="card-title m-0">Works</h5>
                  </div>
                </div>
              </div>
            </div>
            &nbsp;
            <div className="card bg-19">
              <div className="card-body">
                <div className="row">
                  <div className="col-5 p-0 text-center">
                    <u className="text-success">
                      <h1 className="font-l mb-0" id="work_cnt_com_d">
                        work_cnt_com_d
                      </h1>
                    </u>
                  </div>
                  <div className="col-7 p-0">
                    <h5 className="card-title m-0">Works</h5>
                    <p className="card-text m-0">Completed Today</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-19">
              <div className="card-body">
                <div className="row">
                  <div className="col-5 p-0 text-center">
                    <u className="text-success">
                      <h1 className="font-l mb-0" id="work_cnt_com_w">
                        work_cnt_com_w
                      </h1>
                    </u>
                  </div>
                  <div className="col-7 p-0">
                    <h5 className="card-title m-0">Works</h5>
                    <p className="card-text m-0">Completed this week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {#Work List last 10#} */}
        <div className="col-12 col-lg-6">
          <div className="bg-0 pl-3 pt-2">
            <div className="row">
              <div className="col-6">
                <h4>Works</h4>
              </div>
              <div className="col-6 text-right">
                <button onClick="updateWorkTable()" className="btn text-muted">
                  <i className="fa fa-refresh" aria-hidden="true"></i>
                </button>
              </div>
            </div>
            <p className="m-0 text-muted">Latest 10 Works</p>
          </div>
          <table className="table table-borderless text-light" id="work">
            <thead className="bg-0">
              <tr>
                <th scope="col">Related Document</th>
                <th scope="col">Type</th>
                <th scope="col">State</th>
                {/* {#                    <th scope="col">Create Date</th>#} */}
              </tr>
            </thead>
            <tbody>
              {/* {% for work in works %} */}
              <tr>
                <td>
                  <a href="{% url 'work_detail' id=work.id %}">
                    work|truncatechars:30
                  </a>
                </td>

                {/* {% if work.get_type_display == 'Create' %} */}
                <td>
                  <span className="badge badge-pill badge-success">
                    work.get_type_display
                  </span>
                </td>
                {/* {% elif work.get_type_display == 'Edit' %} */}
                <td>
                  <span className="badge badge-pill badge-warning">
                    work.get_type_display
                  </span>
                </td>
                {/* {% elif work.get_type_display == 'Cancel' %} */}
                <td>
                  <span className="badge badge-pill badge-danger">
                    work.get_type_display
                  </span>
                </td>
                {/* {% endif %} */}

                <td>work.get_state_display</td>
                {/* {#                        <td>work.create_date|date:"d-M-Y" work.create_date|time:"H:i"</td>#} */}
              </tr>
              {/* {% endfor %} */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
