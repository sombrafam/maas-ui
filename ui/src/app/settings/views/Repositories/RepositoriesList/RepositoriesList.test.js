import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import RepositoriesList from "./RepositoriesList";

const mockStore = configureStore();

describe("RepositoriesList", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: [],
      },
      packagerepository: {
        loading: false,
        loaded: true,
        items: [
          {
            id: 1,
            name: "main_archive",
            url: "http://archive.ubuntu.com/ubuntu",
            default: true,
            enabled: true,
          },
          {
            id: 2,
            name: "ports_archive",
            url: "http://ports.ubuntu.com/ubuntu-ports",
            default: true,
            enabled: true,
          },
          {
            id: 3,
            name: "extra_archive",
            url: "http://maas.io",
            default: false,
            enabled: true,
          },
          {
            id: 4,
            name: "secret_archive",
            url: "http://www.website.com",
            default: false,
            enabled: false,
          },
        ],
      },
    };
  });

  it("displays a loading component if loading", () => {
    const state = { ...initialState };
    state.packagerepository.loading = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").exists()).toBe(true);
  });

  it("shows the table if there are repositories and loaded is true", () => {
    const state = { ...initialState };
    state.packagerepository.loaded = true;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("MainTable").exists()).toBe(true);
  });

  it("can show a delete confirmation", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    let row = wrapper.find("MainTable").prop("rows")[2];
    expect(row.expanded).toBe(false);
    // Click on the delete button:
    wrapper.find("TableRow").at(3).find("Button").at(1).simulate("click");
    row = wrapper.find("MainTable").prop("rows")[2];
    expect(row.expanded).toBe(true);
  });

  it("can delete a repository", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    // Click on the delete button:
    wrapper.find("TableRow").at(3).find("Button").at(1).simulate("click");
    // Click on the delete confirm button
    wrapper.find("TableRow").at(3).find("Button").at(3).simulate("click");

    // 1. Fetch, 2. Cleanup, 3. Delete
    expect(store.getActions()[2]).toEqual({
      type: "DELETE_PACKAGEREPOSITORY",
      payload: {
        params: {
          id: 3,
        },
      },
      meta: {
        model: "packagerepository",
        method: "delete",
      },
    });
  });

  it("can filter repositories", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    let rows = wrapper.find("MainTable").prop("rows");
    expect(rows.length).toBe(state.packagerepository.items.length);
    act(() => wrapper.find("SearchBox").props().onChange("secret"));
    wrapper.update();
    rows = wrapper.find("MainTable").prop("rows");
    expect(rows.length).toBe(1);
  });

  it("displays default repositories with user-friendly names", () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    const mainRepoRow = wrapper.find("MainTable").prop("rows")[0];
    const extraRepoRow = wrapper.find("MainTable").prop("rows")[1];
    expect(mainRepoRow.columns[0].content).toBe("Ubuntu archive");
    expect(extraRepoRow.columns[0].content).toBe("Ubuntu extra architectures");
  });

  it("adds a message and cleans up packagerepository state when a repo is deleted", () => {
    const state = { ...initialState };
    state.packagerepository.saved = true;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/settings/repositories", key: "testKey" },
          ]}
        >
          <RepositoriesList />
        </MemoryRouter>
      </Provider>
    );
    const actions = store.getActions();
    expect(
      actions.some((action) => action.type === "CLEANUP_PACKAGEREPOSITORY")
    ).toBe(true);
    expect(actions.some((action) => action.type === "ADD_MESSAGE")).toBe(true);
  });
});
