import "../styles/globals.css";
import "bootstrap/scss/bootstrap.scss";
import "@fortawesome/fontawesome-free/scss/fontawesome.scss";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <div className="row mt-5">
        <div className="col-0 col-lg-2" />
        <div className="col-12 col-lg-8">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <a className="navbar-brand" href="% url 'index' %}">
              <img
                src="{% static '/img/dms_logo.png' %}"
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt=""
              />
              DMS
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarText"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav mr-auto">
                <form
                  className="form-inline my-2 my-lg-0 ml-0 ml-lg-5"
                  method="get"
                  action="% url 'internal_doc' %}"
                >
                  <input
                    className="form-control form-control-sm mr-sm-2"
                    type="search"
                    placeholder="Search Internal Document"
                    name="name"
                    style={{ width: "20em" }}
                  />
                  <button
                    className="btn btn-outline-info my-2 my-sm-0"
                    type="submit"
                  >
                    <i className="fa fa-search" />
                  </button>
                </form>
              </ul>
              <span className="navbar-text">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <a className="nav-link" href="{% url 'index' %}">
                      Dashboard
                    </a>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-toggle="dropdown"
                    >
                      Document
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item text-dark disabled font-weight-bold">
                        <i className="fa fa-file-text" aria-hidden="true" />
                        &nbsp;&nbsp;Internal Document
                      </a>
                      <a
                        className="dropdown-item text-dark"
                        href="{% url 'internal_doc' %}"
                      >
                        View All
                      </a>
                      <a
                        className="dropdown-item text-dark"
                        href="{% url 'internal_doc' %}?state=IN"
                      >
                        View: In-Progress
                      </a>
                      <a
                        className="dropdown-item text-dark"
                        href="{% url 'internal_doc' %}?state=RE"
                      >
                        View: Released
                      </a>
                      <a
                        className="dropdown-item text-dark"
                        href="{% url 'internal_doc' %}?state=OB"
                      >
                        View: Obsoleted
                      </a>
                      <a
                        className="dropdown-item text-dark"
                        href="{% url 'internal_doc' %}?state=RC"
                      >
                        View: Recalled
                      </a>
                      <div className="dropdown-divider" />
                      <a
                        className="dropdown-item text-dark"
                        href="% url 'work_create' %}"
                      >
                        Create Document&nbsp;&nbsp;
                        <i className="fa fa-plus-square" aria-hidden="true" />
                      </a>
                      <a
                        className="dropdown-item text-dark"
                        href="% url 'work_edit' %}"
                      >
                        Edit Document&nbsp;&nbsp;
                        <i className="fa fa-pencil-square" aria-hidden="true" />
                      </a>
                      <a
                        className="dropdown-item text-dark"
                        href="% url 'work_cancel' %}"
                      >
                        Cancel Document&nbsp;&nbsp;
                        <i className="fa fa-minus-square" aria-hidden="true" />
                      </a>
                      <div className="dropdown-divider" />
                      <a className="dropdown-item text-dark disabled font-weight-bold">
                        <i className="fa fa-file-text" aria-hidden="true" />
                        &nbsp;&nbsp;External Document
                      </a>
                      <a
                        className="dropdown-item text-dark"
                        href="% url 'external_doc' %}"
                      >
                        View All
                      </a>
                      <a
                        className="dropdown-item text-dark"
                        href="% url 'external_add' %}"
                      >
                        Add Document&nbsp;&nbsp;
                        <i className="fa fa-plus-square" aria-hidden="true" />
                      </a>
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-toggle="dropdown"
                    >
                      Work
                    </a>
                    <div className="dropdown-menu">
                      <a
                        className="dropdown-item text-dark"
                        href="% url 'work_list' %}"
                      >
                        <i className="fa fa-th-list" aria-hidden="true" />
                        &nbsp;&nbsp;Work List
                      </a>
                      <a
                        className="dropdown-item text-dark"
                        href="% url 'work_list' %}?employee={{ request.user.employee.id }}"
                      >
                        <i className="fa fa-briefcase" aria-hidden="true" />
                        &nbsp;&nbsp;My Work
                      </a>
                    </div>
                  </li>
                  <li className="nav-item d-lg-inline d-none">
                    <a className="nav-link disabled">|</a>
                  </li>
                  {/*{% if user.is_authenticated %}*/}
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link"
                      href="#"
                      role="button"
                      data-toggle="dropdown"
                    >
                      <i className="fa fa-user" aria-hidden="true" />
                      &nbsp;&nbsp;user.get_full_name
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item text-dark disabled font-weight-bold">
                        user .username
                      </a>
                      <a
                        className="dropdown-item text-dark"
                        href="% url 'profile' %}"
                      >
                        Profile
                      </a>
                      <div className="dropdown-divider" />
                      <a
                        className="dropdown-item text-dark"
                        href="% url 'logout' %}"
                      >
                        Logout
                      </a>
                    </div>
                  </li>
                  {/*{% else %}*/}
                  <li className="nav-item">
                    <a className="nav-link" href="% url 'login' %}">
                      Login
                    </a>
                  </li>
                  {/*{% endif %}*/}
                </ul>
              </span>
            </div>
          </nav>
        </div>
        <div className="col-0 col-lg-2" />
      </div>
      <div className="container-fluid row m-0 p-0 mt-5 mb-5">
        <div className="col-0 col-lg-2" />
        <div className="col-12 col-lg-8 shadow p-5 h-100 round bg-19 text-light center-cnt">
          <Component {...pageProps} />
        </div>
        <div className="col-0 col-lg-2" />
      </div>
    </>
  );
}

export default MyApp;
