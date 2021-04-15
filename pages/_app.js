import "../styles/globals.scss";
import React, { useEffect } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";

function MyApp({ Component, pageProps }) {
  const [session, loading] = useSession();

  if (loading) return null;

  if (!loading && !session) signIn();

  return (
    <>
      <div className="row mt-5">
        <div className="col-0 col-lg-2" />
        <div className="col-12 col-lg-8">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <a className="navbar-brand" href="/">
              <img
                src="/dms_logo.png"
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
                    <Link href="/">
                      <a className="nav-link">Dashboard</a>
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="/documents"
                      role="button"
                      data-toggle="dropdown"
                    >
                      Document
                    </a>
                    <div className="dropdown-menu">
                      <Link href="/documents">
                        <a className="dropdown-item text-dark">
                          <i className="fa fa-file mr-2" aria-hidden="true" />
                          Document List
                        </a>
                      </Link>
                      <div className="dropdown-divider" />
                      <Link href="/documents/new">
                        <a className="dropdown-item text-dark">
                          <i
                            className="fa fa-plus-square mr-2"
                            aria-hidden="true"
                          />
                          Create Document
                        </a>
                      </Link>
                      <a className="dropdown-item text-dark">
                        <i
                          className="fa fa-pen-square mr-2"
                          aria-hidden="true"
                        />
                        Edit Document
                      </a>
                      <Link href="/documents/x/cancel">
                        <a className="dropdown-item text-dark">
                          <i
                            className="fa fa-minus-square mr-2"
                            aria-hidden="true"
                          />
                          Cancel Document
                        </a>
                      </Link>
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
                      <Link href="/works">
                        <a className="dropdown-item text-dark">
                          <i
                            className="fa fa-th-list mr-2"
                            aria-hidden="true"
                          />
                          Work List
                        </a>
                      </Link>
                    </div>
                  </li>
                  <li className="nav-item d-lg-inline d-none">
                    <a className="nav-link disabled">|</a>
                  </li>
                  {/*{% if user.is_authenticated %}*/}
                  {/* <li className="nav-item dropdown">
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
                  <li className="nav-item">
                    <a className="nav-link" href="% url 'login' %}">
                      Login
                    </a>
                  </li> */}
                  {!session && (
                    <>
                      {/* Not signed in <br />
                      <button onClick={() => signIn()}>Sign in</button> */}
                      <div className="nav-link" onClick={signIn} role="button">
                        Sign in
                      </div>
                    </>
                  )}
                  {session && (
                    <>
                      <div className="nav-link" role="button">
                        <i className="fa fa-user" aria-hidden="true" />
                        &nbsp;&nbsp;Signed in as {session.user.name}
                      </div>
                      {/* <button onClick={() => signOut()}>Sign out</button> */}
                      <div className="nav-link" onClick={signOut} role="button">
                        Sign out
                      </div>
                    </>
                  )}
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
