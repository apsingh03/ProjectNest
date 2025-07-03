import {
  ProjectManagement,
  sequelize,
  Sequelize,
  UserAuth,
} from "../../models";

export const createProject = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const devId = req?.user?.id;
    const payload = { ...req.body, devId };

    const nameAlreadyExist = await ProjectManagement.findOne({
      where: { title: req.body.title, devId },
      transaction: t,
    });

    if (nameAlreadyExist) {
      await t.rollback();
      return res.status(200).send({ msg: "Name Already Exist" });
    } else {
      console.log("Req.body - ", req.body);
      const createQuery = await ProjectManagement.create(payload, {
        transaction: t,
      });
      const updatedQuery = await ProjectManagement.findOne({
        where: { id: createQuery.id },
        order: [["id", "Asc"]],
        transaction: t,
      });
      await t.commit();
      return res.status(200).send({ msg: "success", query: updatedQuery });
    }
  } catch (error) {
    // await t.rollback();
    console.error("Error - ", error);
    return res.status(500).send({ error: error.message });
  }
};

export const getProject = async (req: Request, res: Response) => {
  try {
    const query = await ProjectManagement.findAll({
      attributes: {
        exclude: ["createdAt"],
      },
      include: {
        model: UserAuth,
        as: "UserAuth",
        attributes: {
          exclude: ["updatedAt", "password"],
        },
      },

      // where: { admin_id: req.admin.id },
      order: [["id", "Asc"]],
    });

    return res.status(200).send({ msg: "success", query });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const nameAlreadyExist = await ProjectManagement.findOne({
      where: { name: req.body.name, admin_id: req.admin.id },
      transaction: t,
    });

    if (nameAlreadyExist) {
      await t.rollback();
      return res.status(200).send({ msg: "Name Already Exist" });
    } else {
      const [updated] = await ProjectManagement.update(
        {
          name: req.body.name,
          updatedAt: new Date(),
        },
        {
          where: { id: req.params.id, admin_id: req.admin.id },
          transaction: t,
        }
      );

      // Check if any rows were updated
      if (updated) {
        await t.commit();
        // Fetch the updated record
        const query = await ProjectManagement.findOne({
          where: { id: req.params.id, admin_id: req.admin.id },
        });

        return res.status(200).send({ msg: "success", query });
      } else {
        await t.rollback();
        return res.status(404).send({ msg: "Record not found" });
      }
    }
  } catch (error) {
    await t.rollback();
    return res.status(500).send({ error: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const query = await ProjectManagement.destroy({
      where: { id: req.params.id, admin_id: req.admin.id },
      transaction: t,
    });

    if (query === 0) {
      await t.rollback();
      return res.status(404).send({ msg: "Record not found" });
    }

    // console.log("query Delete - ", query);
    await t.commit();
    return res.status(200).send({ msg: "success" });
  } catch (error) {
    await t.rollback();
    return res.status(500).send({ error: error.message });
  }
};
