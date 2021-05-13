import React, { useCallback } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";

const Header = () => {
  const [session, loading] = useSession();

  const handleSignOut = useCallback(async () => {
    await signOut();

    window.location.replace(
      `https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/logout` +
        `?client_id=${process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(
          process.env.NEXT_PUBLIC_BASE_PATH
        )}` +
        "&response_type=code"
    );
  }, []);

  return (
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
                    <Link href="/documents/x/edit">
                      <a className="dropdown-item text-dark">
                        <i
                          className="fa fa-pen-square mr-2"
                          aria-hidden="true"
                        />
                        Edit Document
                      </a>
                    </Link>
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
                        <i className="fa fa-th-list mr-2" aria-hidden="true" />
                        Work List
                      </a>
                    </Link>
                  </div>
                </li>
                <li className="nav-item d-lg-inline d-none">
                  <a className="nav-link disabled">|</a>
                </li>

                {!loading && !session && (
                  <>
                    <div
                      className="nav-link"
                      onClick={() => {
                        signIn("cognito");
                      }}
                      role="button"
                    >
                      Sign in
                    </div>
                  </>
                )}
                {!loading && session && (
                  <>
                    <div className="nav-link" role="button">
                      <i className="fa fa-user" aria-hidden="true" />
                      &nbsp;&nbsp;Signed in as {session.user.name}
                    </div>
                    <div
                      className="nav-link"
                      onClick={handleSignOut}
                      role="button"
                    >
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
  );
};

export default Header;
