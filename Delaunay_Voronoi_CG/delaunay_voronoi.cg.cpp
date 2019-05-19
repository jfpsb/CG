#include <fstream>

// CGAL headers
#include <CGAL/Exact_predicates_inexact_constructions_kernel.h>
#include <CGAL/Delaunay_triangulation_2.h>

#include <CGAL/point_generators_2.h>

// Qt headers
#include <QtGui>
#include <QString>
#include <QActionGroup>
#include <QFileDialog>
#include <QInputDialog>

// GraphicsView items and event filters (input classes)
#include <CGAL/Qt/TriangulationGraphicsItem.h>
#include <CGAL/Qt/VoronoiGraphicsItem.h>

// for viewportsBbox
#include <CGAL/Qt/utility.h>

// the two base classes
#include "ui_delaunay_voronoi.h"
#include <CGAL/Qt/DemosMainWindow.h>

typedef CGAL::Exact_predicates_inexact_constructions_kernel K;
typedef K::Point_2 Point_2;
typedef K::Iso_rectangle_2 Iso_rectangle_2;

typedef CGAL::Delaunay_triangulation_2<K> Delaunay;

class MainWindow :
    public CGAL::Qt::DemosMainWindow,
    public Ui::delaunay_voronoi_cg
{
    Q_OBJECT

private:
    Delaunay dt;
    QGraphicsScene scene;

    CGAL::Qt::TriangulationGraphicsItem<Delaunay> * dgi;
    CGAL::Qt::VoronoiGraphicsItem<Delaunay> * vgi;

public:
    MainWindow();

public Q_SLOTS:

    void on_actionShowVoronoi_toggled(bool checked);

    void on_actionRecenter_triggered();

Q_SIGNALS:
    void changed();
};


MainWindow::MainWindow()
    : DemosMainWindow()
{
    setupUi(this);

    this->graphicsView->setAcceptDrops(false);

    std::ifstream in("data/pontos.cin");
    std::istream_iterator<Point_2> begin(in);
    std::istream_iterator<Point_2> end;
    std::vector<Point_2> points(begin, end);

    for(int i = 0; i < points.size(); i++)
    {
        dt.insert(points[i]);
    }

    // Add a GraphicItem for the Delaunay triangulation
    dgi = new CGAL::Qt::TriangulationGraphicsItem<Delaunay>(&dt);

    QObject::connect(this, SIGNAL(changed()),
                     dgi, SLOT(modelChanged()));

    dgi->setEdgesPen(QPen(Qt::black, 0.05, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin));
    dgi->setVerticesPen(QPen(Qt::red, 5, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin));
    scene.addItem(dgi);
    dgi->show();

    // Add a GraphicItem for the Voronoi diagram
    vgi = new CGAL::Qt::VoronoiGraphicsItem<Delaunay>(&dt);

    QObject::connect(this, SIGNAL(changed()),
                     vgi, SLOT(modelChanged()));

    vgi->setEdgesPen(QPen(Qt::blue, 0.08, Qt::SolidLine, Qt::RoundCap, Qt::RoundJoin));
    scene.addItem(vgi);
    vgi->show();

    //
    // Setup the scene and the view
    //
    scene.setItemIndexMethod(QGraphicsScene::NoIndex);
    scene.setSceneRect(-100, -100, 100, 100);
    this->graphicsView->setScene(&scene);

    // The navigation adds zooming and translation functionality to the
    // QGraphicsView
    this->addNavigation(this->graphicsView);
}

void
MainWindow::on_actionShowVoronoi_toggled(bool checked)
{
    if(vgi->isVisible())
        vgi->setVisible(false);
    else
        vgi->setVisible(true);
}

void
MainWindow::on_actionRecenter_triggered()
{
    this->graphicsView->setSceneRect(dgi->boundingRect());
    this->graphicsView->fitInView(dgi->boundingRect(), Qt::KeepAspectRatio);
}


#include "delaunay_voronoi.cg.moc"
#include <CGAL/Qt/resources.h>

int main(int argc, char **argv)
{
    QApplication app(argc, argv);

    app.setOrganizationDomain("geometryfactory.com");
    app.setOrganizationName("GeometryFactory");
    app.setApplicationName("Delaunay_triangulation_2 demo");

    // Import resources from libCGAL (QT5).
    CGAL_QT_INIT_RESOURCES;

    MainWindow mainWindow;
    mainWindow.show();

    mainWindow.on_actionRecenter_triggered();

    QStringList args = app.arguments();
    args.removeAt(0);
    Q_FOREACH(QString filename, args)
    {
        mainWindow.open(filename);
    }

    return app.exec();
}

