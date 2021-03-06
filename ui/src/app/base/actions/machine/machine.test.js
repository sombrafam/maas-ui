import machine from "./machine";

describe("machine actions", () => {
  it("should handle fetching machines", () => {
    expect(machine.fetch()).toEqual({
      type: "FETCH_MACHINE",
      meta: {
        model: "machine",
        method: "list",
      },
      payload: {
        params: { limit: 25 },
      },
    });
  });

  it("can handle creating machines", () => {
    expect(
      machine.create({ name: "machine1", description: "a machine" })
    ).toEqual({
      type: "CREATE_MACHINE",
      meta: {
        model: "machine",
        method: "create",
      },
      payload: {
        params: {
          name: "machine1",
          description: "a machine",
        },
      },
    });
  });

  it("can handle setting the pool", () => {
    expect(machine.setPool("abc123", 909)).toEqual({
      type: "SET_MACHINE_POOL",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "set-pool",
          extra: {
            pool_id: 909,
          },
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle setting the zone", () => {
    expect(machine.setZone("abc123", 909)).toEqual({
      type: "SET_MACHINE_ZONE",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "set-zone",
          extra: {
            zone_id: 909,
          },
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle turning on the machine", () => {
    expect(machine.on("abc123")).toEqual({
      type: "TURN_MACHINE_ON",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "on",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle turning off the machine", () => {
    expect(machine.off("abc123")).toEqual({
      type: "TURN_MACHINE_OFF",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "off",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle checking the machine power", () => {
    expect(machine.checkPower("abc123")).toEqual({
      type: "CHECK_MACHINE_POWER",
      meta: {
        model: "machine",
        method: "check_power",
      },
      payload: {
        params: {
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle acquiring a machine", () => {
    expect(machine.acquire("abc123")).toEqual({
      type: "ACQUIRE_MACHINE",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "acquire",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle releasing a machine", () => {
    expect(machine.release("abc123")).toEqual({
      type: "RELEASE_MACHINE",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "release",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle deploying a machine", () => {
    const extra = {
      osystem: "ubuntu",
      distro_series: "bionic",
      install_kvm: false,
    };
    expect(machine.deploy("abc123", extra)).toEqual({
      type: "DEPLOY_MACHINE",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "deploy",
          extra,
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle aborting a machine", () => {
    expect(machine.abort("abc123")).toEqual({
      type: "ABORT_MACHINE",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "abort",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle commissioning a machine", () => {
    expect(
      machine.commission(
        "abc123",
        true,
        false,
        false,
        false,
        true,
        true,
        [
          { id: 0, name: "commissioningScript0" },
          { id: 2, name: "commissioningScript2" },
        ],
        [
          { id: 0, name: "testingScript0" },
          { id: 2, name: "testScript2" },
        ],
        { testingScript0: { url: "www.url.com" } }
      )
    ).toEqual({
      meta: {
        method: "action",
        model: "machine",
      },
      payload: {
        params: {
          action: "commission",
          extra: {
            enable_ssh: true,
            skip_bmc_config: false,
            skip_networking: false,
            skip_storage: false,
            commissioning_scripts: [0, 2, "update_firmware", "configure_hba"],
            testing_scripts: [0, 2],
            script_input: { testingScript0: { url: "www.url.com" } },
          },
          system_id: "abc123",
        },
      },
      type: "COMMISSION_MACHINE",
    });
  });

  it("can handle testing a machine", () => {
    expect(
      machine.test(
        "abc123",
        [
          { id: 0, name: "test0" },
          { id: 2, name: "test2" },
        ],
        true,
        { "test-0": { url: "www.url.com" } }
      )
    ).toEqual({
      type: "TEST_MACHINE",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "test",
          extra: {
            enable_ssh: true,
            script_input: { "test-0": { url: "www.url.com" } },
            testing_scripts: [0, 2],
          },
          system_id: "abc123",
        },
      },
    });
  });

  it("can create a failed script results action", () => {
    expect(
      machine.fetchFailedScriptResults([
        { system_id: 0, name: "machine0" },
        { system_id: 1, name: "machine1" },
      ])
    ).toEqual({
      meta: {
        method: "get_latest_failed_testing_script_results",
        model: "machine",
      },
      payload: {
        params: {
          system_ids: [0, 1],
        },
      },
      type: "FETCH_FAILED_SCRIPT_RESULTS",
    });
  });

  it("can create a suppress script results action", () => {
    expect(
      machine.suppressScriptResults({ system_id: 0, name: "machine0" }, [
        { id: 0, name: "script0" },
        { id: 2, name: "script2" },
      ])
    ).toEqual({
      meta: {
        method: "set_script_result_suppressed",
        model: "machine",
      },
      payload: {
        params: {
          script_result_ids: [0, 2],
          system_id: 0,
        },
      },
      type: "SET_SCRIPT_RESULT_SUPPRESSED",
    });
  });

  it("can putting a machine into rescue mode", () => {
    expect(machine.rescueMode("abc123")).toEqual({
      type: "MACHINE_RESCUE_MODE",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "rescue-mode",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle making a machine exit rescue mode", () => {
    expect(machine.exitRescueMode("abc123")).toEqual({
      type: "MACHINE_EXIT_RESCUE_MODE",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "exit-rescue-mode",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle marking a machine as broken", () => {
    expect(machine.markBroken("abc123")).toEqual({
      type: "MARK_MACHINE_BROKEN",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "mark-broken",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle marking a machine as fixed", () => {
    expect(machine.markFixed("abc123")).toEqual({
      type: "MARK_MACHINE_FIXED",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "mark-fixed",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle overriding failed testing on a machine", () => {
    expect(machine.overrideFailedTesting("abc123")).toEqual({
      type: "MACHINE_OVERRIDE_FAILED_TESTING",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "override-failed-testing",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle locking a machine", () => {
    expect(machine.lock("abc123")).toEqual({
      type: "LOCK_MACHINE",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "lock",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle unlocking a machine", () => {
    expect(machine.unlock("abc123")).toEqual({
      type: "UNLOCK_MACHINE",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "unlock",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle deleting a machine", () => {
    expect(machine.delete("abc123")).toEqual({
      type: "DELETE_MACHINE",
      meta: {
        model: "machine",
        method: "action",
      },
      payload: {
        params: {
          action: "delete",
          extra: {},
          system_id: "abc123",
        },
      },
    });
  });

  it("can handle tagging a machine", () => {
    expect(machine.tag("abc123", [{ name: "tag1" }, { name: "tag2" }])).toEqual(
      {
        type: "TAG_MACHINE",
        meta: {
          model: "machine",
          method: "action",
        },
        payload: {
          params: {
            action: "tag",
            extra: { tags: ["tag1", "tag2"] },
            system_id: "abc123",
          },
        },
      }
    );
  });

  it("can handle cleaning machines", () => {
    expect(machine.cleanup()).toEqual({
      type: "CLEANUP_MACHINE",
    });
  });
});
